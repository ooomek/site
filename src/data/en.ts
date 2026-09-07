import type {
  CompanyData,
  LicenseData,
  ServiceData,
  PartnerData,
  ContentPageData,
  ContentPageBreadcrumb,
} from "../components/site/types";

export const companyEn: CompanyData = {
  legal_address: "17 Grechesky Prospekt, Saint Petersburg, 191036, Russia",
  actual_address:
    "Office 489, Building 1, 60 Makarova Embankment, Saint Petersburg, 199155, Russia",
  phone: null,
  email: "info@expert-mek.com",
  presentation_url: "/pdf/presentation.pdf",
};

export const servicesEn: ServiceData[] = [
  {
    id: 1,
    title: "Technical audit",
    short_description:
      "An independent, comprehensive assessment of a company's technical condition and readiness to undertake nuclear industry projects.",
    slug: "technical-audit",
    icon_url: "/icons/icon-1.png",
    image_url: "services/technical-audit.jpg",
  },
  {
    id: 2,
    title: "Industrial safety",
    short_description:
      "Ensuring industrial safety through compliance with regulatory requirements and technical diagnostics.",
    slug: "industrial-safety",
    icon_url: "/icons/icon-2.png",
    image_url: "services/industrial-safety.jpg",
  },
  {
    id: 3,
    title: "Equipment conformity assessment through acceptance testing and inspection",
    short_description:
      "Conformity assessment of equipment, components, materials and semi-finished products for nuclear power plants in international projects.",
    slug: "equipment-conformity-assessment",
    icon_url: "/icons/icon-3.png",
    image_url: "services/equipment-conformity-assessment.jpg",
  },
  {
    id: 4,
    title: "Project support",
    short_description:
      "Comprehensive support throughout equipment manufacturing and delivery, with schedule and risk monitoring.",
    slug: "project-support",
    icon_url: "/icons/icon-4.png",
    image_url: "services/project-support.jpg",
  },
  {
    id: 5,
    title: "Verification of compliance with customer incoming inspection requirements",
    short_description:
      "Verification that equipment being shipped meets contractual requirements for quantity, quality, packaging and marking.",
    slug: "customer-input-control",
    icon_url: "/icons/icon-5.png",
    image_url: "services/customer-input-control.jpg",
  },
  {
    id: 6,
    title: "Technical and organisational project support",
    short_description:
      "Preparation and support for certification, documentation, quality management systems and manufacturing processes in the nuclear industry.",
    slug: "technical-organizational-support",
    icon_url: "/icons/icon-6.png",
    image_url: "services/technical-organizational-support.jpg",
  },
];

export const licensesEn: LicenseData[] = [
  {
    id: 5298,
    title: "Licence No. CE-(U)-03-205-5298",
    description:
      "For the operation of radiation sources and storage facilities for nuclear materials, radioactive substances and radioactive waste.",
    image_url: "licenses/5298.png",
    document_url: "pdf/5298.pdf",
  },
  {
    id: 5023,
    title: "Licence No. СЕ-(У)-03-101-5023",
    description:
      "For the operation of nuclear installations, including nuclear power plants, ships and other vehicles equipped with nuclear reactors.",
    image_url: "licenses/5023.png",
    document_url: "pdf/5023.pdf",
  },
  {
    id: 3,
    title: "Licence No. Л043-00109-78/00141167",
    description:
      "For industrial safety assessments of facilities and documentation.",
    image_url: "licenses/00109-78.png",
    document_url: "pdf/vipeska.pdf",
  },
];

export const certificateEn: LicenseData[] = [
  {
    id: 205,
    title: "Certificate of conformity No. RA.RU.13HA77-0205 dated 6 April 2026",
    description:
      "Compliance with GOST R ISO 9001-2015. Scope: organising and conducting conformity assessment through acceptance and testing of products intended for nuclear facilities; organising and conducting safety assessments (safety justification reviews) of nuclear facilities and/or activities in the field of nuclear energy.",
    image_url: "certificates/13HA77-0205.png",
    document_url: "certificates/13HA77-0205.png",
  },
  {
    id: 12315,
    title: "Certificate of conformity No. 012315 QM101 dated 6 April 2026",
    description:
      "Compliance with ISO 9001:2015. Scope: organising and conducting conformity assessment through acceptance and testing of products intended for nuclear facilities; organising and conducting safety assessments (safety justification reviews) of nuclear facilities and/or activities in the field of nuclear energy.",
    image_url: "certificates/012315 QM101.png",
    document_url: "certificates/012315 QM101.png",
  },
];

export const partnersEn: PartnerData[] = [
  {
    id: 1,
    name: 'VO "Bezopasnost"',
    logo_url: "partners/vosafety.svg",
    url: "https://vosafety.ru/",
  },
  {
    id: 2,
    name: "NovEnergoProm",
    logo_url: "partners/novenergoprom.png",
    url: "https://novenergoprom.ru/",
  },
  {
    id: 3,
    name: "Astiag JSC",
    logo_url: "partners/asting.png",
    url: "https://www.astiag.ru/",
  },
  {
    id: 4,
    name: "AEM Technologies JSC",
    logo_url: "partners/aem.svg",
    url: "https://rkm.rosatom.ru/innov/pir-ipr/vertical/atomenergomash/ao-aem-tekhnologii/",
  },
  {
    id: 5,
    name: "Alliance Gamma JSC",
    logo_url: "partners/algamma.jpg",
    url: "https://www.atomic-energy.ru/Alyans-Gamma",
  },
  {
    id: 6,
    name: "AAEM Turbine Technologies",
    logo_url: "partners/aaem.png",
    url: "https://www.atomic-energy.ru/AAEM",
  },
  {
    id: 7,
    name: "Vologda Bearing Factory",
    logo_url: "partners/vbs.png",
    url: "http://www.vbf.ru/",
  },
  {
    id: 8,
    name: "Znamya Truda Plant CJSC",
    logo_url: "partners/zzt.png",
    url: "https://zzt.ru/",
  },
  {
    id: 9,
    name: "NPF Bitek",
    logo_url: "partners/bitek.png",
    url: "https://bitek-e.ru/",
  },
  {
    id: 10,
    name: "BNS Baltic Stainless Steel",
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
    name: "Izhora Metal",
    logo_url: "partners/kmz.png",
    url: "https://kmz-9.ru/",
  },
  {
    id: 13,
    name: "KRON Engineering",
    logo_url: "partners/kron.png",
    url: "https://kron-spb.com/products/svarochnye/materialy/elektrody/",
  },
  {
    id: 14,
    name: "RITON",
    logo_url: "partners/riton.png",
    url: "https://riton.pro/",
  },
  {
    id: 15,
    name: "EnergoIntegration",
    logo_url: "partners/energo.png",
    url: "http://www.energo-i.ru/",
  },
];

export const aboutPageEn: ContentPageData = {
  title: "About us",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      MEK Limited Liability Company (MEK LLC) is a Russian company providing
      a full range of services in the field of nuclear energy, including:
    </p>

    <ul>
      <li>Verification of product compliance with customer incoming inspection requirements</li>
      <li>Technical audits</li>
      <li>Conformity assessment through acceptance and testing of equipment, components and materials for nuclear power plants in international projects</li>
      <li>Manufacturing monitoring and manufacturer support</li>
      <li>Industrial safety assessments</li>
      <li>Technical and organisational project support</li>
    </ul>

    <p>
      MEK LLC was established in 2004 as part of the implementation of the Russian
      Federation's obligations to supervise the manufacturing quality of equipment
      supplied for the construction of nuclear power facilities abroad: Bushehr NPP
      (Iran), Tianwan NPP (China), Kudankulam NPP (India) and Belene NPP (Bulgaria),
      as well as Russian nuclear power plants.
    </p>

    <p>
      MEK LLC provides services for nuclear facilities under licences issued by the
      Federal Environmental, Industrial and Nuclear Supervision Service of Russia
      (Rostechnadzor). Our highly qualified personnel have completed training and
      certification in Russian nuclear energy regulatory documentation.
    </p>

    <p>
      Our team consists of highly qualified specialists with extensive experience
      in quality assurance and safety in the nuclear industry during equipment
      manufacturing and delivery.
      <br />
      MEK LLC experts undergo periodic assessments of their knowledge of federal
      rules and regulations governing the use of nuclear energy.
    </p>
  `,
};

export const aboutPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "About us",
  middle_href: "/about",
  current_label: "About us",
};

export const contactsPageEn: ContentPageData = {
  title: "Contacts",
  subtitle: null,
  image_url: null,
  content: `
    <h3>Registered address</h3>
    <p>17 Grechesky Prospekt, Saint Petersburg, 191036, Russia</p>

    <h3>Office address</h3>
    <p>Office 489, Building 1, 60 Makarova Embankment, Saint Petersburg, 199155, Russia</p>

    <h3>Telephone</h3>
    <p>+7 812 6792749</p>

    <h3>Email</h3>
    <p>info@expert-mek.com</p>
  `,
};

export const contactsPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "Contacts",
  middle_href: "/contacts",
  current_label: "Contacts",
};

export const technicalAuditPageEn: ContentPageData = {
  title: "Technical audit",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      A technical audit is a comprehensive, independent assessment of a company's
      technical condition and its readiness to undertake nuclear industry projects.
    </p>

    <p>As part of this work, we help the customer:</p>

    <ul>
      <li>
        assess a manufacturer's readiness for a data reliability audit required
        to participate in Rosatom State Corporation procurement
      </li>
      <li>
        confirm readiness to start and continue production in accordance with
        industry standards and requirements
      </li>
      <li>
        assess the company's quality management system to obtain the necessary
        certificates and permits
      </li>
      <li>
        identify risks, non-conformities and bottlenecks, and receive recommendations
        for addressing them
      </li>
    </ul>

    <p>
      The outcome is a formal report and a corrective action plan to improve processes.
    </p>
  `,
};

export const technicalAuditPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "Services",
  middle_href: "/services",
  current_label: "Technical audit",
};

export const industrialSafetyPageEn: ContentPageData = {
  title: "Industrial safety",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      Industrial safety is ensured through compliance with
      <b>Federal Law No. 116-ФЗ, "On the Industrial Safety of Hazardous Production
      Facilities"</b>, as well as other regulations and industry rules.
    </p>

    <p>
      Technical diagnostics comprises a range of measures using non-destructive
      testing methods to assess the accident risk of industrial equipment. It is
      performed when damage is detected, or after the equipment's design or assigned
      service life has expired.
    </p>

    <p>
      This diagnostic work forms part of an industrial safety assessment of technical
      devices. It helps determine the equipment's remaining service life and provide
      justification for extending its operation.
    </p>

    <p>Diagnostic assessments may cover:</p>

    <ul>
      <li>gas pipelines</li>
      <li>industrial pipelines</li>
      <li>gas distribution systems</li>
      <li>buildings and structures</li>
      <li>lifting equipment, including cranes and crane runways</li>
    </ul>

    <p>
      The outcome is an expert assessment report registered with Rostechnadzor.
    </p>
  `,
};

export const industrialSafetyPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "Services",
  middle_href: "/services",
  current_label: "Industrial safety",
};

export const technicalOrganizationalPageEn: ContentPageData = {
  title: "Technical and organisational project support",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      We provide technical and organisational support for projects. This includes
      preparation and support for nuclear facility certification; introduction of
      imported materials and components in accordance with nuclear facility
      requirements; preparation of manufacturing processes to comply with federal
      rules and regulations; quality management system audits; implementation of
      quality management systems; and development of the associated documentation.
    </p>

    <p>Our services also include:</p>

    <ul>
      <li>preparation for welding procedure qualification and the supporting documentation</li>
      <li>development of process and technical documentation</li>
      <li>manufacturing support in accordance with quality plans</li>
      <li>participation in testing and support during incoming inspection</li>
    </ul>
  `,
};

export const technicalOrganizationalPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "Services",
  middle_href: "/services",
  current_label: "Technical and organisational project support",
};

export const projectSupportPageEn: ContentPageData = {
  title: "Project support",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      We provide comprehensive support throughout equipment manufacturing and delivery.
    </p>

    <p>
      This work aims to ensure that project deadlines are met, regulatory and
      technical documentation requirements are fulfilled, and manufacturing risks
      are reduced.
    </p>

    <p>Our specialists:</p>

    <ul>
      <li>monitor and update the detailed equipment manufacturing schedule</li>
      <li>analyse manufacturing processes and identify risks to delivery deadlines</li>
      <li>help coordinate approval of technical documentation, permits and reports in accordance with customer requirements, regulatory authorities and international standards</li>
      <li>respond promptly to deviations, disputes and changes in requirements</li>
      <li>coordinate communication between the manufacturer, the customer and inspection bodies</li>
    </ul>

    <p>
      The outcome is a detailed report with a corrective action plan and recommendations
      for improving manufacturing.
    </p>
  `,
};

export const projectSupportPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "Services",
  middle_href: "/services",
  current_label: "Project support",
};

export const equipmentConformityPageEn: ContentPageData = {
  title: "Equipment conformity assessment through acceptance testing and inspection",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      MEK LLC conducts conformity assessment through acceptance testing and inspection
      of equipment, components, assemblies, materials and semi-finished products for
      nuclear power plants in international projects.
    </p>

    <p>
      This work is performed in accordance with the federal rules and regulations
      of the Russian Federation and the requirements of international projects.
    </p>

    <p>Inspection covers two main product groups:</p>

    <ul>
      <li>
        Mechanical equipment includes reactor components and internals, pumps and
        pump units, piping components and assemblies, valves, heat exchangers,
        pressure vessels, ventilation equipment and HVAC systems.
      </li>
      <li>
        Electrical equipment includes electrical products, instrumentation and
        control devices, cables and wires, accident localisation equipment, and
        instrumentation and control system components.
      </li>
    </ul>

    <p>
      The outcome is a completed inspection report and a closed-out equipment
      quality plan.
    </p>
  `,
};

export const equipmentConformityPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "Services",
  middle_href: "/services",
  current_label: "Equipment conformity assessment through acceptance testing and inspection",
};

export const customerInputControlPageEn: ContentPageData = {
  title: "Verification of compliance with customer incoming inspection requirements",
  subtitle: null,
  image_url: null,
  content: `
    <p>
      This service verifies that equipment being shipped meets contractual requirements
      for quantity, quality, packaging and marking.
    </p>

    <p>
      An incoming inspection report is prepared following the assessment.
    </p>

    <p>The procedure includes:</p>

    <ul>
      <li>checking the completeness and accuracy of the equipment certificate or passport</li>
      <li>comparing its information against regulatory and technical documentation and the supply contract</li>
      <li>verifying that the equipment meets the specified requirements and visually inspecting the equipment and packaging for mechanical damage</li>
      <li>checking key overall and connection dimensions against the design documentation and contract terms</li>
    </ul>

    <p>
      The outcome is a positive incoming inspection conclusion for the equipment.
    </p>
  `,
};

export const customerInputControlPageEnBreadcrumb: ContentPageBreadcrumb = {
  middle_label: "Services",
  middle_href: "/services",
  current_label: "Verification of compliance with customer incoming inspection requirements",
};
