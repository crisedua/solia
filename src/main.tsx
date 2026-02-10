import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import OnboardPage from './pages/OnboardPage';
import OnboardSuccess from './pages/OnboardSuccess';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/onboard/:clientId" element={<OnboardPage />} />
        <Route path="/onboard/:clientId/success" element={<OnboardSuccess />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
