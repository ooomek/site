import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/welcome';
import InfoPage from './pages/info-page';
import Service from './pages/service';
import ServicesPage from './pages/services-page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/service" element={<Service />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </BrowserRouter>
  );
}