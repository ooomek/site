# External news and articles

The homepage shows the two newest external publications. `/news` shows the full list. Both views use `src/data/news.ts`, sort by publication date, and support Russian and English. Russian remains the default.

To add a publication:

1. Save the supplied article image in `public/news/`.
2. Add an entry to `externalArticles` in `src/data/news.ts` with a unique `id`, `publisher`, ISO date (`YYYY-MM-DD`), original article `url`, root-relative image path (`/news/filename.jpg`), and Russian/English `title` and `summary`.
3. Use the original Russian title and an accurate English translation. Write a short original summary; full articles stay on the publisher's website. Links open the original publication in a new tab.
4. Run `npm run build` and check both `/news` and `/news?lang=en`.

The current publisher is `atomicEnergy` (Атомная энергия 2.0). Its logo and the two supplied article photos are stored locally so the page does not rely on third-party image requests. Original sources:

- [Technical audit article](https://www.atomic-energy.ru/articles/2026/08/21/167945), [supplied image](https://www.atomic-energy.ru/files/styles/first_foto/public/images/2026/08/photo_5206217579800764008_y.jpg)
- [MEK IT article](https://www.atomic-energy.ru/articles/2026/09/07/168339), [supplied image](https://www.atomic-energy.ru/files/styles/first_foto/public/images/2026/09/mek_it.jpg)
- [Publisher logo](https://www.atomic-energy.ru/themes/custom/aenergy/logo.svg)

Admin-authored company news and blog posts are a separate, future feature. This section currently manages external publications in the data file and does not change the admin system.
