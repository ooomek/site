import type { Language } from '../lib/language';

type LocalizedText = Record<Language, string>;

export const newsPublishers = {
  atomicEnergy: {
    name: { ru: 'Атомная энергия 2.0', en: 'Atomic Energy 2.0' },
    url: 'https://www.atomic-energy.ru/',
    logo: '/media/news/atomic-energy-logo.svg',
  },
};

export type ExternalArticle = {
  id: string;
  publisher: keyof typeof newsPublishers;
  publishedAt: string;
  url: string;
  image: string;
  title: LocalizedText;
  summary: LocalizedText;
};

// Add external publications here. Both views sort by publication date, newest first.
// See docs/news.md for the entry format and image/source guidelines.
export const externalArticles: ExternalArticle[] = [
  {
    id: 'mek-it-2026',
    publisher: 'atomicEnergy',
    publishedAt: '2026-09-07',
    url: 'https://www.atomic-energy.ru/articles/2026/09/07/168339',
    image: '/media/news/mek-it.jpg',
    title: {
      ru: 'МЭК IT: Интеграция цифровых решений в производственный процесс',
      en: 'MEK IT: Integrating digital solutions into production processes',
    },
    summary: {
      ru: 'МЭК IT разрабатывает цифровые системы и решения с применением AI, опираясь на промышленную экспертизу компании. В статье — объединение данных об оборудовании, документах, сроках и ответственных сотрудниках, а также пример системы МЭК Management.',
      en: "MEK IT develops digital systems and AI solutions informed by the company's industrial expertise. The article explores connecting equipment, documentation, deadlines, and responsible employees within shared workflows, with MEK Management as one practical example.",
    },
  },
  {
    id: 'proactive-technical-audit-2026',
    publisher: 'atomicEnergy',
    publishedAt: '2026-08-21',
    url: 'https://www.atomic-energy.ru/articles/2026/08/21/167945',
    image: '/media/news/technical-audit.jpg',
    title: {
      ru: 'Технический аудит на опережение первично позволит исключить системные ошибки перед изготовлением',
      en: 'Proactive technical audits help prevent systemic errors before manufacturing',
    },
    summary: {
      ru: 'Как МЭК выявляет производственные риски до начала изготовления оборудования, сопровождает контроль качества и учитывает специальные требования международных проектов АЭС. Материал рассказывает о техническом аудите, приемочных испытаниях и предотвращении несоответствий на ранних этапах.',
      en: 'How MEK identifies production risks before equipment manufacturing begins, supports quality control, and addresses the specific requirements of international nuclear power projects. The article covers technical audits, acceptance testing, and detecting nonconformities early in the process.',
    },
  },
];
