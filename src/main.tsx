import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './admin/Admin';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';
import { FirebaseDataProvider } from './context/FirebaseDataContext';
import { LanguageProvider } from './context/LanguageContext';
import './config/firebase';
import './examples/firestoreExamples';
import './i18n/config'; // Initialize react-i18next

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <FirebaseAuthProvider>
        <FirebaseDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/" element={<App />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </FirebaseDataProvider>
      </FirebaseAuthProvider>
    </LanguageProvider>
  </StrictMode>
);
