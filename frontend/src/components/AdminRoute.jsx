import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Componente para proteger rutas de administrador.
 * Debe usarse dentro de un ProtectedRoute para asegurar que el usuario ya está autenticado.
 */
export default function AdminRoute() {
    const { user, viewAsStudent } = useAuthStore();

    // Si el usuario no es admin o si el admin activó el "modo estudiante"
    if (!user || user.role !== 'admin' || viewAsStudent) {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
}
