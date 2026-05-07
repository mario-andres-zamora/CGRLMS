import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { hasAdminPanelAccess } from '../utils/authUtils';

/**
 * Componente para proteger rutas de administrador.
 * 
 * @param {Array} roles - Opcional. Lista de roles permitidos. Si no se provee, usa hasAdminPanelAccess.
 */
export default function AdminRoute({ roles }) {
    const { user, viewAsStudent } = useAuthStore();

    const hasAccess = roles 
        ? roles.includes(user?.role) 
        : hasAdminPanelAccess(user);

    if (!hasAccess || viewAsStudent) {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
}

