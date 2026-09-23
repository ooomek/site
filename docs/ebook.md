# Children's ebook prototype

Open `/ebook/chapter-1` or choose **Детская книга** in the public navigation. This feature is entirely local to the frontend: it has no API, Supabase schema, admin screens, or saved reader data.

## Content

`src/data/chapter1Data.ts` supplies the page images, audio sequence, speaker labels, and quiz questions to the reusable components in `src/components/EBookReader/`.

- Keep the designed page images in `public/chapter-1/images/`. They are displayed in full with `object-fit: contain`, including pages with different proportions. The enlarge control opens a reading view with a link to the original image.
- Audio files are in the existing `audio/story-tell`, `audio/niki`, and `audio/pasha` folders. Playback starts with a user click and then advances automatically through the configured sequence using a single audio element.
- The requested `pasha-4` step deliberately uses the supplied `pasha-3.mp3`, as confirmed by the site owner. Its sequence ID remains `pasha-4`.
- Finishing the final recording opens the quiz. Readers who finish the book without listening can also choose **Проверить себя** after reaching the last page.
- Wrong answers allow retries. The final score shows completion of all five questions, not the number answered correctly on the first attempt.

To add another hardcoded chapter, create a new `ChapterData` object and pass it to `EBookReader` in a new route. Chapter-specific introduction labels live alongside the data. No backend is needed for this prototype.

## Book engine

`page-flip` is pinned to `2.0.7`. `scripts/patch-page-flip.mjs` runs after installation to apply narrowly scoped lifecycle and interaction fixes to its distributed builds. Keep the patch and exact dependency version together; review both before upgrading. Repeated installation is supported, and unexpected package contents fail the patch rather than silently ignoring it.

## Validation

```sh
npm run test:ebook
npm run build
```

The ebook tests use the actual component/config with controlled media events. They cover asset existence, the required playlist order, controls, error recovery, pending playback races, final completion, and unmount cleanup.

Browser checks should cover desktop spreads and keyboard arrows, mobile single pages and dragging, first/last-page boundaries, resize, enlarged reading, sequential audio, quiz retry/success/restart, and navigation away while audio is playing. Audio errors remain on the current fragment with a retry action instead of skipping content.
