import { useEffect, useId, useReducer, useRef } from 'react';
import { Headphones, LoaderCircle, Pause, Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import type { AudioTrack } from './types';
import './audio-player.css';

type AudioPlayerProps = {
  tracks: AudioTrack[];
  onComplete: () => void;
  paused?: boolean;
};

type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'finished' | 'error';
type PlaybackState = {
  index: number;
  currentTime: number;
  duration: number;
  status: PlaybackStatus;
  error: string;
};
type AudioControls = {
  play: () => void;
  pause: () => void;
  replay: () => void;
  stop: () => void;
  seek: (time: number) => void;
};

const initialPlayback: PlaybackState = {
  index: 0,
  currentTime: 0,
  duration: 0,
  status: 'idle',
  error: '',
};

function formatTime(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export function AudioPlayer({ tracks, onComplete, paused = false }: AudioPlayerProps) {
  const [state, update] = useReducer(
    (previous: PlaybackState, patch: Partial<PlaybackState>) => ({ ...previous, ...patch }),
    initialPlayback,
  );
  const controlsRef = useRef<AudioControls | null>(null);
  const completeRef = useRef(onComplete);
  const pausedRef = useRef(paused);
  const progressId = useId();
  const titleId = useId();

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) controlsRef.current?.pause();
  }, [paused]);

  useEffect(() => {
    // A single media element owns the whole playlist, so tracks cannot overlap.
    const audio = new Audio();
    audio.preload = 'metadata';
    let index = 0;
    let generation = 0;
    let wantsPlayback = false;
    let finished = false;
    let failed = false;
    let disposed = false;

    const reportError = (message: string) => {
      if (disposed) return;
      wantsPlayback = false;
      failed = true;
      audio.pause();
      update({ status: 'error', error: message });
    };

    const playCurrent = () => {
      if (disposed || !tracks[index] || pausedRef.current) return;
      const request = ++generation;
      wantsPlayback = true;
      failed = false;
      update({ status: 'loading', error: '' });
      void audio.play().then(() => {
        if (disposed || request !== generation || !wantsPlayback) return;
        if (!audio.paused) update({ status: 'playing' });
      }).catch((error: unknown) => {
        if (disposed || request !== generation || !wantsPlayback) return;
        const denied = error instanceof DOMException && error.name === 'NotAllowedError';
        reportError(denied
          ? 'Нажми «Слушать», чтобы продолжить историю.'
          : 'Не получилось включить этот фрагмент. Попробуй ещё раз.');
      });
    };

    const loadTrack = (nextIndex: number, autoplay: boolean) => {
      ++generation;
      wantsPlayback = false;
      audio.pause();
      index = nextIndex;
      finished = false;
      failed = false;
      update({ ...initialPlayback, index });
      const track = tracks[index];
      if (!track) return;
      audio.src = track.src;
      audio.load();
      if (autoplay) playCurrent();
    };

    const updateProgress = () => {
      if (disposed) return;
      update({
        currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
        duration: Number.isFinite(audio.duration) ? audio.duration : 0,
      });
    };

    const onPlaying = () => {
      if (!disposed && wantsPlayback && !audio.paused) update({ status: 'playing' });
    };

    const onWaiting = () => {
      if (!disposed && wantsPlayback && !audio.paused) update({ status: 'loading' });
    };

    const onEnded = () => {
      // Ignore an old queued event after stop, replay, or a source change.
      if (disposed || !wantsPlayback || !audio.ended || audio.error || finished) return;
      wantsPlayback = false;
      if (index < tracks.length - 1) {
        loadTrack(index + 1, true);
      } else {
        ++generation;
        finished = true;
        update({ status: 'finished', currentTime: Number.isFinite(audio.duration) ? audio.duration : 0 });
        completeRef.current();
      }
    };

    const onError = () => {
      if (!disposed && audio.error) {
        ++generation;
        reportError('Этот фрагмент пока недоступен. Попробуй ещё раз чуть позже — а пока можно читать книгу.');
      }
    };

    const controls: AudioControls = {
      play: () => {
        if (finished) loadTrack(0, true);
        else if (failed) loadTrack(index, true);
        else playCurrent();
      },
      pause: () => {
        ++generation;
        const wasActive = wantsPlayback;
        wantsPlayback = false;
        audio.pause();
        if (wasActive && !disposed) update({ status: 'paused' });
      },
      replay: () => loadTrack(0, true),
      stop: () => loadTrack(0, false),
      seek: (time) => {
        if (!Number.isFinite(audio.duration) || !Number.isFinite(time) || failed || finished) return;
        audio.currentTime = Math.min(Math.max(time, 0), audio.duration);
        updateProgress();
      },
    };

    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('durationchange', updateProgress);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    controlsRef.current = controls;
    loadTrack(0, false);

    return () => {
      disposed = true;
      ++generation;
      wantsPlayback = false;
      if (controlsRef.current === controls) controlsRef.current = null;
      audio.pause();
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('durationchange', updateProgress);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeAttribute('src');
      audio.load();
    };
  }, [tracks]);

  const active = state.status === 'playing' || state.status === 'loading';
  const track = tracks[state.index];
  const disabled = tracks.length === 0 || paused;
  const playLabel = state.status === 'finished' ? 'Слушать снова' : state.status === 'error' ? 'Повторить' : 'Слушать';
  const progressPercent = state.duration > 0 ? Math.min(100, state.currentTime / state.duration * 100) : 0;

  return (
    <section className="ebook-audio" aria-labelledby={titleId}>
      <div className="ebook-audio__heading">
        <span className="ebook-audio__badge" aria-hidden="true"><Headphones size={22} /></span>
        <div>
          <h2 id={titleId}>Слушать главу</h2>
          <p>У каждого героя — свой голос</p>
        </div>
      </div>

      <div className="ebook-audio__body">
        <button
          type="button"
          className="ebook-audio__play"
          disabled={disabled}
          onClick={() => active ? controlsRef.current?.pause() : controlsRef.current?.play()}
          aria-label={active ? 'Пауза' : `${playLabel} главу`}
        >
          {state.status === 'loading' ? <LoaderCircle className="ebook-audio__spinner" size={20} aria-hidden="true" />
            : active ? <Pause size={20} fill="currentColor" aria-hidden="true" />
              : <Play size={20} fill="currentColor" aria-hidden="true" />}
          <span>{active ? 'Пауза' : playLabel}</span>
        </button>

        <div className="ebook-audio__track">
          <div className="ebook-audio__track-info">
            <span className="ebook-audio__speaker" aria-live="polite" aria-atomic="true">
              <Volume2 size={15} aria-hidden="true" /> {track?.speaker ?? 'История готовится'}
            </span>
            <span className="ebook-audio__counter">Фрагмент {tracks.length ? state.index + 1 : 0} / {tracks.length}</span>
          </div>
          <label className="ebook-audio__sr-only" htmlFor={progressId}>Позиция в текущем фрагменте</label>
          <input
            id={progressId}
            className="ebook-audio__progress"
            type="range"
            min={0}
            max={state.duration || 1}
            step={0.1}
            value={Math.min(state.currentTime, state.duration || 1)}
            disabled={disabled || !state.duration || state.status === 'finished' || state.status === 'error'}
            aria-valuetext={`${formatTime(state.currentTime)} из ${formatTime(state.duration)}`}
            onChange={(event) => controlsRef.current?.seek(Number(event.target.value))}
            style={{ background: `linear-gradient(to right, #ff7a00 ${progressPercent}%, #dde5ee ${progressPercent}%)` }}
          />
          <div className="ebook-audio__time"><span>{formatTime(state.currentTime)}</span><span>{formatTime(state.duration)}</span></div>
        </div>

        <div className="ebook-audio__actions">
          <button type="button" onClick={() => controlsRef.current?.replay()} disabled={disabled} aria-label="Слушать главу сначала" title="Сначала">
            <RotateCcw size={19} aria-hidden="true" /><span>Сначала</span>
          </button>
          <button type="button" onClick={() => controlsRef.current?.stop()} disabled={tracks.length === 0} aria-label="Остановить и вернуться к началу главы" title="Стоп">
            <Square size={16} fill="currentColor" aria-hidden="true" /><span>Стоп</span>
          </button>
        </div>
      </div>
      {state.error && <p className="ebook-audio__message" role="status">{state.error}</p>}
      {state.status === 'finished' && <p className="ebook-audio__message" role="status">История закончилась. Время маленького открытия!</p>}
    </section>
  );
}

export default AudioPlayer;
