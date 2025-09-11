import { Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';
import { FirebaseDataProvider } from '../context/FirebaseDataContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AdminThemeProvider } from './context/AdminThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ResumePage from './pages/ResumePage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';

export default function Admin() {
  return (
    <FirebaseDataProvider>
      <ThemeProvider>
        <AdminThemeProvider>
          <FirebaseAuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="skills" element={<ResumePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                {/* Add more admin routes here */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          </FirebaseAuthProvider>
        </AdminThemeProvider>
      </ThemeProvider>
    </FirebaseDataProvider>
  );
}
