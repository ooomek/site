import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/welcome';
import InfoPage from './pages/info-page';
import Service from './pages/service';
import ServicesPage from './pages/services-page';
import ContactPage from './pages/contact-page';
import AgreementActionPage from './pages/services/customer-input-control/page';
import EquipmentConformityPage from './pages/services/equipment-conformity-assessment/page';
import IndustrialSafetyPage from './pages/services/industrial-safety/page';
import ProjectSupportPage from './pages/services/project-support/page';
import TechnicalAuditPage from './pages/services/technical-audit/page';
import TechnicalOrganizationPage from './pages/services/technical-organizational-support/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<InfoPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/service" element={<Service />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/services/customer-input-control" element={<AgreementActionPage />} />
        <Route path="/services/equipment-conformity-assessment" element={<EquipmentConformityPage />} />
        <Route path="/services/industrial-safety" element={<IndustrialSafetyPage />} />
        <Route path="/services/project-support" element={<ProjectSupportPage />} />
        <Route path="/services/technical-audit" element={<TechnicalAuditPage />} />
        <Route path="/services/technical-organizational-support" element={<TechnicalOrganizationPage />} />

      </Routes>
    </BrowserRouter>
  );
}