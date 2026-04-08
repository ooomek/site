import type {
  CompanyData,
  LicenseData,
  ServiceData,
  PartnerData,
  ContentPageData,
  ContentPageBreadcrumb
} from "../components/site/types";

export const companyRu: CompanyData = {
  legal_address: "191036, г. Санкт-Петербург, Греческий проспект, д. 17",
  actual_address:
    "199155, г. Санкт-Петербург, набережная Макарова, д. 60, ст. 1, офис 489",
  phone: null,
  email: "info@expert-mek.com",
  presentation_url: "/pdf/presentation.pdf",
};

export const servicesRu: ServiceData[] = [
  {
    id: 1,
    title: "Технический аудит",
    short_description:
      "Независимая комплексная оценка технического состояния и готовности предприятия к реализации проектов в атомной отрасли.",
    slug: "technical-audit",
    icon_url: "/icons/icon-1.png",
    image_url: null,
  },
  {
    id: 2,
    title: "Промышленная безопасность",
    short_description:
      "Обеспечение промышленной безопасности за счет соблюдения требований нормативных актов и проведения технической диагностики.",
    slug: "industrial-safety",
    icon_url: "/icons/icon-2.png",
    image_url: null,
  },
  {
    id: 3,
    title:
      "Оценка соответствия в форме приемочных испытаний и инспекционного контроля оборудования",
    short_description:
      "Оценка соответствия оборудования, комплектующих, материалов и полуфабрикатов для АЭС в рамках международных проектов.",
    slug: "equipment-conformity-assessment",
    icon_url: "/icons/icon-3.png",
    image_url: null,
  },
  {
    id: 4,
    title: "Сопровождение проекта",
    short_description:
      "Комплексное сопровождение процесса изготовления и поставки оборудования с контролем сроков и рисков.",
    slug: "project-support",
    icon_url: "/icons/icon-4.png",
    image_url: null,
  },
  {
    id: 5,
    title:
      "Подтверждение соответствия продукции требованиям входного контроля заказчика",
    short_description:
      "Проверка соответствия отгружаемого оборудования условиям договора по количеству, качеству, упаковке и маркировке.",
    slug: "customer-input-control",
    icon_url: "/icons/icon-5.png",
    image_url: null,
  },
  {
    id: 6,
    title: "Техническое и организационное сопровождение проекта",
    short_description:
      "Подготовка, сопровождение сертификации, документации, СМК и производственных процессов для атомной отрасли.",
    slug: "technical-organizational-support",
    icon_url: "/icons/icon-6.png",
    image_url: null,
  },
];

export const licensesRu: LicenseData[] = [
  {
    id: 5298,
    title: "Лицензия № CE-(U)-03-205-5298",
    description:
      "На эксплуатацию радиационных источников, пунктов хранения ядерных материалов, радиоактивных веществ и радиоактивных отходов.",
    image_url: "licenses/5298.png",
    document_url: null,
  },
  {
    id: 5023,
    title: "Лицензия № СЕ-(У)-03-101-5023",
    description:
      "На эксплуатацию ядерных установок, включая атомные станции, суда и другие транспортные средства с ядерными реакторами.",
    image_url: "licenses/5023.png",
    document_url: null,
  },
  {
    id: 3,
    title: "Лицензия № Л043-00109-78/00141167",
    description:
      "Деятельность по проведению экспертизы промышленной безопасности объектов и документации.",
    image_url: "licenses/00109-78.png",
    document_url: null,
  },
];

export const partnersRu: PartnerData[] = [
  {
    id: 1,
    name: 'ВО "Безопасность"',
    logo_url: "partners/vosafety.svg",
    url: "https://vosafety.ru/",
  },
  {
    id: 2,
    name: "НовЭнергоПром",
    logo_url: "partners/novenergoprom.png",
    url: "https://novenergoprom.ru/",
  },
  {
    id: 3,
    name: 'АО "Астиаг"',
    logo_url: "partners/asting.png",
    url: "https://www.astiag.ru/",
  },
  {
    id: 4,
    name: 'АО "АЭМ-Технологии"',
    logo_url: "partners/aem.svg",
    url: "https://rkm.rosatom.ru/innov/pir-ipr/vertical/atomenergomash/ao-aem-tekhnologii/",
  },
  {
    id: 5,
    name: 'АО "Альянс Гамма"',
    logo_url: "partners/algamma.jpg",
    url: "https://www.atomic-energy.ru/Alyans-Gamma",
  },
  {
    id: 6,
    name: "Турбинные технологии ААЭМ",
    logo_url: "partners/aaem.png",
    url: "https://www.atomic-energy.ru/AAEM",
  },
  {
    id: 7,
    name: "Вологодский подшипниковый завод",
    logo_url: "partners/vbs.png",
    url: "http://www.vbf.ru/",
  },
  {
    id: 8,
    name: 'ЗАО "Завод Знамя Труда"',
    logo_url: "partners/zzt.png",
    url: "https://zzt.ru/",
  },
  {
    id: 9,
    name: "НПФ Битек",
    logo_url: "partners/bitek.png",
    url: "https://bitek-e.ru/",
  },
  {
    id: 10,
    name: 'БНС "Балтийская нержавеющая сталь"',
    logo_url: "partners/zaobns.png",
    url: "https://zaobns.ru/",
  },
  {
    id: 11,
    name: "West-Engineering",
    logo_url: "partners/west.png",
    url: "https://west-e.ru/en/about/",
  },
  {
    id: 12,
    name: "Ижора металл",
    logo_url: "partners/kmz.png",
    url: "https://kmz-9.ru/",
  },
  {
    id: 13,
    name: "КРОН инженерное дело",
    logo_url: "partners/kron.png",
    url: "https://kron-spb.com/products/svarochnye/materialy/elektrody/",
  },
  {
    id: 14,
    name: "РИТОН",
    logo_url: "partners/riton.png",
    url: "https://riton.pro/",
  },
  {
    id: 15,
    name: "ЭнергоИнтеграция",
    logo_url: "partners/energo.png",
    url: "http://www.energo-i.ru/",
  },
];
export const aboutPageRu: ContentPageData = {
  title: "О компании",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      Общество с ограниченной ответственностью "МЭК" (ООО «МЭК») – российская компания,
      оказывающая полный спектр услуг в области использования атомной энергии, а именно:
    </p>

    <ul>
      <li>Подтверждение соответствия продукции требованиям входного контроля Заказчика</li>
      <li>Проведение технического аудита</li>
      <li>Проведение оценки соответствия в форме приемки и испытаний оборудования, комплектующих и материалов для АЭС для международных проектов</li>
      <li>Проведение промышленного мониторинга (сопровождение изготовителя)</li>
      <li>Проведение экспертизы промышленной безопасности</li>
      <li>Техническое и организационное сопровождение проекта</li>
    </ul>

    <p>
      ООО "МЭК" образовано в 2004 году в рамках реализации обязательств Российской Федерации
      по надзору за качеством изготовления оборудования, поставляемого при сооружении объектов
      атомной энергетики за рубежом для АЭС «Бушер» (Иран), АЭС «Тяньвань» (Китай),
      АЭС «Куданкулам» (Индия), АЭС «Белене» (Болгария), а также российских атомных станций.
    </p>

    <p>
      ООО "МЭК" оказывает услуги для объектов использования атомной энергии (ОИАЭ)
      на основании имеющихся лицензий Федеральной службы по экологическому,
      технологическому и атомному надзору (РОСТЕХНАДЗОР) и используя
      высококвалифицированный персонал, прошедший обучение и аттестацию на знания НД
      в области использования атомной энергии РФ.
    </p>

    <p>
      Коллектив компании состоит из высококвалифицированных специалистов, обладающих
      большим опытом работ в области обеспечения качества и безопасности в атомной отрасли
      при изготовлении и поставки оборудования.
      <br />
      Эксперты ООО "МЭК" с заданной периодичностью проходят проверку знаний
      федеральных норм и правил в области использования атомной энергии.
    </p>
  `,
};

export const aboutPageRuBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "О компании",
  middle_href: "/about",
  current_label: "О компании",
};