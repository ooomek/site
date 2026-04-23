import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/welcome';
import InfoPage from './pages/info-page';
import ServicesPage from './pages/services-page';
import ContactPage from './pages/contact-page';
import AgreementActionPage from './pages/services/customer-input-control/page';
import EquipmentConformityPage from './pages/services/equipment-conformity-assessment/page';
import IndustrialSafetyPage from './pages/services/industrial-safety/page';
import ProjectSupportPage from './pages/services/project-support/page';
import TechnicalAuditPage from './pages/services/technical-audit/page';
import TechnicalOrganizationPage from './pages/services/technical-organizational-support/page';
import ExamPage from './pages/exam-page';
import AdminLoginPage from './pages/admin-login-page';
import AdminDashboardPage from './pages/admin-dashboard-page';
import AdminQuestionsPage from './pages/admin-questions-page';
const SITE_URL = 'https://expert-mek.com';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Welcome canonical={`${SITE_URL}/`} />}
        />
        <Route
          path="/about"
          element={<InfoPage canonical={`${SITE_URL}/about`} />}
        />
        <Route
          path="/contacts"
          element={<ContactPage canonical={`${SITE_URL}/contacts`} />}
        />

        <Route
          path="/services"
          element={<ServicesPage canonical={`${SITE_URL}/services`} />}
        />

        <Route
          path="/services/customer-input-control"
          element={
            <AgreementActionPage
              canonical={`${SITE_URL}/services/customer-input-control`}
            />
          }
        />
        <Route
          path="/services/equipment-conformity-assessment"
          element={
            <EquipmentConformityPage
              canonical={`${SITE_URL}/services/equipment-conformity-assessment`}
            />
          }
        />
        <Route
          path="/services/industrial-safety"
          element={
            <IndustrialSafetyPage
              canonical={`${SITE_URL}/services/industrial-safety`}
            />
          }
        />
        <Route
          path="/services/project-support"
          element={
            <ProjectSupportPage
              canonical={`${SITE_URL}/services/project-support`}
            />
          }
        />
        <Route
          path="/services/technical-audit"
          element={
            <TechnicalAuditPage
              canonical={`${SITE_URL}/services/technical-audit`}
            />
          }
        />
        <Route
          path="/services/technical-organizational-support"
          element={
            <TechnicalOrganizationPage
              canonical={`${SITE_URL}/services/technical-organizational-support`}
            />
          }
        />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}