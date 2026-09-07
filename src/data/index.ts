import * as ru from './ru';
import * as en from './en';
import { useLanguage } from '../lib/language';

const russian = {
  company: ru.companyRu,
  services: ru.servicesRu,
  licenses: ru.licensesRu,
  certificate: ru.certificateRu,
  partners: ru.partnersRu,
  aboutPage: ru.aboutPageRu,
  aboutPageBreadcrumb: ru.aboutPageRuBreadcrumb,
  contactsPage: ru.contactsPageRu,
  contactsPageBreadcrumb: ru.contactsPageRuBreadcrumb,
  technicalAuditPage: ru.technicalAuditPageRu,
  technicalAuditPageBreadcrumb: ru.technicalAuditPageRuBreadcrumb,
  industrialSafetyPage: ru.industrialSafetyPageRu,
  industrialSafetyPageBreadcrumb: ru.industrialSafetyPageRuBreadcrumb,
  technicalOrganizationalPage: ru.technicalOrganizationalPageRu,
  technicalOrganizationalPageBreadcrumb: ru.technicalOrganizationalPageRuBreadcrumb,
  projectSupportPage: ru.projectSupportPageRu,
  projectSupportPageBreadcrumb: ru.projectSupportPageRuBreadcrumb,
  equipmentConformityPage: ru.equipmentConformityPageRu,
  equipmentConformityPageBreadcrumb: ru.equipmentConformityPageRuBreadcrumb,
  customerInputControlPage: ru.customerInputControlPageRu,
  customerInputControlPageBreadcrumb: ru.customerInputControlPageRuBreadcrumb,
};

const english: typeof russian = {
  company: en.companyEn,
  services: en.servicesEn,
  licenses: en.licensesEn,
  certificate: en.certificateEn,
  partners: en.partnersEn,
  aboutPage: en.aboutPageEn,
  aboutPageBreadcrumb: en.aboutPageEnBreadcrumb,
  contactsPage: en.contactsPageEn,
  contactsPageBreadcrumb: en.contactsPageEnBreadcrumb,
  technicalAuditPage: en.technicalAuditPageEn,
  technicalAuditPageBreadcrumb: en.technicalAuditPageEnBreadcrumb,
  industrialSafetyPage: en.industrialSafetyPageEn,
  industrialSafetyPageBreadcrumb: en.industrialSafetyPageEnBreadcrumb,
  technicalOrganizationalPage: en.technicalOrganizationalPageEn,
  technicalOrganizationalPageBreadcrumb: en.technicalOrganizationalPageEnBreadcrumb,
  projectSupportPage: en.projectSupportPageEn,
  projectSupportPageBreadcrumb: en.projectSupportPageEnBreadcrumb,
  equipmentConformityPage: en.equipmentConformityPageEn,
  equipmentConformityPageBreadcrumb: en.equipmentConformityPageEnBreadcrumb,
  customerInputControlPage: en.customerInputControlPageEn,
  customerInputControlPageBreadcrumb: en.customerInputControlPageEnBreadcrumb,
};

export function useSiteData() {
  const { language } = useLanguage();
  return language === 'en' ? english : russian;
}
