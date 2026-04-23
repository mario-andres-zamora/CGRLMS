import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import SurveyView from './pages/SurveyView';
import CertificateView from './pages/CertificateView';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import AdminModules from './pages/AdminModules';
import Reports from './pages/Reports';
import AdminUsers from './pages/AdminUsers';
import AdminDirectory from './pages/AdminDirectory';
import AdminDepartments from './pages/AdminDepartments';
import AdminBadges from './pages/AdminBadges';
import AdminLessonEditor from './pages/AdminLessonEditor';
import AdminSettings from './pages/AdminSettings';
import AdminAssignments from './pages/AdminAssignments';
import AdminPhishing from './pages/AdminPhishing';
import AdminInteractions from './pages/AdminInteractions';
import AdminSurveys from './pages/AdminSurveys';
import AdminSurveyDetail from './pages/AdminSurveyDetail';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import Maintenance from './pages/Maintenance';
import DisabledAccount from './pages/DisabledAccount';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import ToastSoundEffect from './components/ToastSoundEffect';
import AppToaster from './components/AppToaster';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastSoundEffect />
        <AppToaster />

        <Routes>
          {/* Ruta pública de login */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:id" element={<ModuleDetail />} />
              <Route path="/lessons/:id" element={<LessonView />} />
              <Route path="/quizzes/:id" element={<QuizView />} />
              <Route path="/surveys/:id" element={<SurveyView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />

              {/* Rutas de administrador protegidas */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/modules" element={<AdminModules />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/users/:userId/profile" element={<Profile />} />
                <Route path="/admin/directory" element={<AdminDirectory />} />
                <Route path="/admin/areas" element={<AdminDepartments />} />
                <Route path="/admin/badges" element={<AdminBadges />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/assignments" element={<AdminAssignments />} />
                <Route path="/admin/phishing" element={<AdminPhishing />} />
                <Route path="/admin/interactions" element={<AdminInteractions />} />
                <Route path="/admin/surveys" element={<AdminSurveys />} />
                <Route path="/admin/surveys/:id" element={<AdminSurveyDetail />} />
                <Route path="/admin/lessons/:id/editor" element={<AdminLessonEditor />} />
              </Route>
            </Route>

            {/* Rutas protegidas a pantalla completa (sin Layout) */}
            <Route path="/certificates/module/:moduleId" element={<CertificateView />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Página 404, 500 y Mantenimiento - Fuera del Layout para pantalla completa */}
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/disabled" element={<DisabledAccount />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
