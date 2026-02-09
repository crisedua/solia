import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ConnectionPage from './pages/ConnectionPage';
import ConnectionSuccess from './pages/ConnectionSuccess';
import OAuthSuccess from './pages/OAuthSuccess';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/connections/:linkId" element={<ConnectionPage />} />
        <Route path="/connections/:linkId/success" element={<ConnectionSuccess />} />
        <Route path="/oauth/success" element={<OAuthSuccess />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
