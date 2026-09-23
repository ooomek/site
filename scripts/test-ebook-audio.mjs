import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));

function loadTypeScript(relativePath, dependencies = {}, globals = {}) {
  const filename = resolve(root, relativePath);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require(name) {
      if (name in dependencies) return dependencies[name];
      if (name.endsWith('.css')) return {};
      throw new Error(`Unexpected test dependency: ${name}`);
    },
    DOMException,
    ...globals,
  }, { filename });
  return exports;
}

const { chapter1Data } = loadTypeScript('src/data/chapter1Data.ts');
const expectedOrder = ['st-1', 'niki-1', 'pasha-1', 'niki-3', 'st-2', 'pasha-2', 'niki-4', 'st-3', 'pasha-4', 'niki-5', 'st-4'];

// A deterministic native-media substitute. Each play promise is controlled by
// the test, allowing late browser resolutions/rejections to be reproduced.
class FakeAudio extends EventTarget {
  src = '';
  currentTime = 0;
  duration = NaN;
  paused = true;
  ended = false;
  error = null;
  pendingPlays = [];
  loadedSources = [];

  load() {
    this.currentTime = 0;
    this.duration = NaN;
    this.ended = false;
    this.error = null;
    if (this.src) this.loadedSources.push(this.src);
  }

  play() {
    this.paused = false;
    this.ended = false;
    return new Promise((resolvePlay, rejectPlay) => {
      this.pendingPlays.push({ resolve: resolvePlay, reject: rejectPlay });
    });
  }

  pause() { this.paused = true; }

  removeAttribute(name) {
    if (name === 'src') this.src = '';
  }

  metadata(duration = 30) {
    this.duration = duration;
    this.dispatchEvent(new Event('loadedmetadata'));
  }

  finish() {
    this.ended = true;
    this.paused = true;
    this.currentTime = this.duration;
    this.dispatchEvent(new Event('ended'));
  }

  fail() {
    this.error = { code: 4 };
    this.dispatchEvent(new Event('error'));
  }
}

function descendants(node) {
  if (Array.isArray(node)) return node.flatMap(descendants);
  if (!node || typeof node !== 'object') return [];
  return [node, ...descendants(node.props?.children)];
}

function textContent(node) {
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'object') return textContent(node.props?.children);
  return String(node);
}

// Execute the actual component with a minimal hook host. Assertions use its
// rendered controls and native-media effects; playlist logic is never copied.
function mountPlayer(overrides = {}) {
  const hooks = [];
  const instances = [];
  let cursor = 0;
  let dirty = true;
  let pendingEffects = [];
  let tree;
  let completed = 0;
  let props = { tracks: chapter1Data.audioSequence, onComplete: () => completed++, ...overrides };

  const react = {
    useReducer(reducer, initial) {
      const position = cursor++;
      hooks[position] ??= { value: initial };
      const hook = hooks[position];
      return [hook.value, (action) => { hook.value = reducer(hook.value, action); dirty = true; }];
    },
    useRef(initial) {
      const position = cursor++;
      hooks[position] ??= { current: initial };
      return hooks[position];
    },
    useId() {
      return `audio-test-${cursor++}`;
    },
    useEffect(effect, dependencies) {
      const position = cursor++;
      const previous = hooks[position];
      if (!previous || dependencies.some((dependency, index) => !Object.is(dependency, previous.dependencies[index]))) {
        pendingEffects.push(() => {
          previous?.cleanup?.();
          hooks[position] = { dependencies, cleanup: effect() };
        });
      }
    },
  };
  const jsx = (type, elementProps) => ({ type, props: elementProps });
  const { AudioPlayer } = loadTypeScript('src/components/EBookReader/AudioPlayer.tsx', {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'lucide-react': {},
  }, {
    Audio: class extends FakeAudio {
      constructor() { super(); instances.push(this); }
    },
  });

  const render = () => {
    let renders = 0;
    while (dirty) {
      assert.ok(++renders < 10, 'component render must settle');
      dirty = false;
      cursor = 0;
      pendingEffects = [];
      tree = AudioPlayer(props);
      pendingEffects.forEach(effect => effect());
    }
    return tree;
  };

  render();
  return {
    get media() { return instances.at(-1); },
    get instanceCount() { return instances.length; },
    get completed() { return completed; },
    get text() { return textContent(render()); },
    get progress() { return descendants(render()).find(node => node.type === 'input' && node.props.type === 'range').props; },
    button(label) {
      const button = descendants(render()).find(node => node.type === 'button' && node.props['aria-label'] === label);
      assert.ok(button, `button '${label}' should exist`);
      return button.props;
    },
    click(label) {
      const button = this.button(label);
      assert.equal(button.disabled, false, `button '${label}' should be enabled`);
      button.onClick();
      render();
    },
    rerender(patch) {
      props = { ...props, ...patch };
      dirty = true;
      render();
    },
    unmount() {
      hooks.forEach(hook => hook?.cleanup?.());
    },
  };
}

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

test('chapter config has the requested order, speaker names, and existing local assets', () => {
  assert.deepEqual(Array.from(chapter1Data.audioSequence, track => track.id), expectedOrder);
  const speakers = { st: 'Рассказчик', niki: 'Ники', pasha: 'Паша' };
  for (const track of chapter1Data.audioSequence) {
    assert.equal(track.speaker, speakers[track.id.split('-')[0]]);
    assert.ok(existsSync(resolve(root, 'public', track.src.slice(1))), `Missing audio: ${track.src}`);
  }
  assert.equal(chapter1Data.pages.length, 8);
  for (const page of chapter1Data.pages) {
    assert.ok(existsSync(resolve(root, 'public', page.image.slice(1))), `Missing page: ${page.image}`);
  }
});

test('one media element plays the exact sequence and completes once after the final track', t => {
  const player = mountPlayer();
  t.after(() => player.unmount());
  assert.equal(player.media.paused, true, 'initial playback requires a user gesture');
  player.click('Слушать главу');
  for (let index = 0; index < chapter1Data.audioSequence.length; index++) {
    const track = chapter1Data.audioSequence[index];
    assert.equal(player.media.src, track.src);
    assert.ok(player.text.includes(track.speaker));
    assert.ok(player.text.includes(`Фрагмент ${index + 1} / 11`));
    assert.equal(player.completed, 0);
    player.media.metadata();
    player.media.finish();
  }
  assert.deepEqual(player.media.loadedSources, Array.from(chapter1Data.audioSequence, track => track.src));
  assert.equal(player.completed, 1);
  player.media.finish();
  assert.equal(player.completed, 1, 'duplicate native ended event must not reopen the quiz');
  assert.equal(player.instanceCount, 1);
  player.button('Слушать снова главу');
});

test('pause preserves position; stop resets; replay starts the whole chapter without overlapping media', t => {
  const player = mountPlayer();
  t.after(() => player.unmount());
  player.click('Слушать главу');
  player.media.finish();
  player.media.metadata(40);
  player.progress.onChange({ target: { value: '12' } });
  player.click('Пауза');
  assert.equal(player.media.currentTime, 12);
  assert.equal(player.media.paused, true);
  player.media.finish();
  assert.equal(player.media.src, chapter1Data.audioSequence[1].src, 'queued ended event after pause is ignored');
  player.click('Слушать главу сначала');
  assert.equal(player.media.src, chapter1Data.audioSequence[0].src);
  assert.equal(player.media.currentTime, 0);
  assert.equal(player.media.paused, false);
  player.click('Остановить и вернуться к началу главы');
  assert.equal(player.media.currentTime, 0);
  assert.equal(player.media.paused, true);
  assert.equal(player.media.src, chapter1Data.audioSequence[0].src);
  assert.equal(player.instanceCount, 1);
  assert.equal(player.completed, 0);
});

test('rapid stop/replay ignores obsolete play promise rejections and resolutions', async t => {
  const player = mountPlayer();
  t.after(() => player.unmount());
  player.click('Слушать главу');
  const obsolete = player.media.pendingPlays[0];
  player.click('Остановить и вернуться к началу главы');
  player.click('Слушать главу сначала');
  obsolete.reject(new DOMException('Interrupted by a new load', 'AbortError'));
  await flushPromises();
  player.button('Пауза');
  assert.equal(player.media.paused, false);
  player.click('Остановить и вернуться к началу главы');
  player.media.pendingPlays[1].resolve();
  await flushPromises();
  assert.equal(player.media.paused, true);
  player.button('Слушать главу');
  assert.equal(player.instanceCount, 1);
});

test('missing media stops the sequence and retries the same fragment', t => {
  const player = mountPlayer();
  t.after(() => player.unmount());
  player.click('Слушать главу');
  player.media.finish();
  const failedSource = player.media.src;
  player.media.fail();
  assert.equal(player.media.paused, true);
  assert.ok(player.text.includes('Этот фрагмент пока недоступен'));
  player.media.finish();
  assert.equal(player.media.src, failedSource);
  assert.equal(player.completed, 0);
  player.click('Повторить главу');
  assert.equal(player.media.src, failedSource);
  assert.equal(player.media.error, null);
  assert.equal(player.media.paused, false);
});

test('browser autoplay denial remains recoverable by another user gesture', async t => {
  const player = mountPlayer();
  t.after(() => player.unmount());
  player.click('Слушать главу');
  player.media.pendingPlays[0].reject(new DOMException('Gesture required', 'NotAllowedError'));
  await flushPromises();
  assert.ok(player.text.includes('Нажми «Слушать»'));
  assert.equal(player.media.paused, true);
  player.click('Повторить главу');
  player.media.pendingPlays[1].resolve();
  await flushPromises();
  player.button('Пауза');
});

test('opening the quiz pauses playback and closing it does not unexpectedly resume', t => {
  const player = mountPlayer();
  t.after(() => player.unmount());
  player.click('Слушать главу');
  player.rerender({ paused: true });
  assert.equal(player.media.paused, true);
  assert.equal(player.button('Слушать главу').disabled, true);
  player.rerender({ paused: false });
  assert.equal(player.media.paused, true);
  player.click('Слушать главу');
  assert.equal(player.media.paused, false);
  assert.equal(player.instanceCount, 1);
});

test('unmount pauses and unloads media, ignores late promises, and removes completion listener', async () => {
  const player = mountPlayer({ tracks: [chapter1Data.audioSequence.at(-1)] });
  player.click('Слушать главу');
  const pending = player.media.pendingPlays[0];
  player.unmount();
  assert.equal(player.media.paused, true);
  assert.equal(player.media.src, '');
  pending.reject(new Error('Late rejection after route change'));
  await flushPromises();
  player.media.finish();
  assert.equal(player.completed, 0);
});
