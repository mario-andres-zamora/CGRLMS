import { useAuthStore } from '../store/authStore';
import { useUsers } from '../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { TableSkeleton } from '../components/skeletons/TableSkeleton';

// Modular Components
import UserHeader from '../components/admin/users/UserHeader';
import UserTable from '../components/admin/users/UserTable';
import UserEditModal from '../components/admin/users/UserEditModal';

export default function AdminUsers() {
    const { user: currentUser, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const { filteredUsers, loading, searchTerm, setSearchTerm, departments, actions } = useUsers();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900/40 p-10 rounded-[3rem] border border-white/5">
                    <div className="space-y-4 w-full max-w-md">
                        <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse"></div>
                        <div className="h-12 w-full bg-white/5 rounded-2xl animate-pulse"></div>
                    </div>
                    <div className="h-16 w-full md:w-96 bg-white/5 rounded-3xl animate-pulse"></div>
                </div>
                <div className="bg-slate-900/20 rounded-[3rem] p-10 border border-white/5">
                    <TableSkeleton rows={8} cols={7} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-full w-full mx-auto space-y-2 animate-fade-in pb-20 px-1 md:px-2 pt-2">
            {/* Action Bar Header */}
            <UserHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onBack={() => navigate('/admin')}
            />

            {/* Main Table Content */}
            <UserTable
                users={filteredUsers}
                currentUserId={currentUser?.id}
                onEdit={(u) => {
                    actions.edit.setUser({ ...u });
                    actions.edit.setOpen(true);
                }}
                onReset={(u) => {
                    actions.reset.setUser(u);
                    actions.reset.setOpen(true);
                }}
                onDelete={(u) => {
                    actions.delete.setUser(u);
                    actions.delete.setOpen(true);
                }}
                viewProfile={(id) => navigate(`/admin/users/${id}/profile`)}
            />

            {/* Edit User Modal */}
            <UserEditModal
                user={actions.edit.user}
                departments={departments}
                isOpen={actions.edit.isOpen}
                onClose={() => actions.edit.setOpen(false)}
                onUpdate={actions.edit.setUser}
                onSave={actions.edit.save}
                onSync={actions.edit.sync}
            />

            {/* Confirm Actions */}
            <ConfirmModal
                isOpen={actions.reset.isOpen}
                onClose={() => actions.reset.setOpen(false)}
                onConfirm={() => actions.reset.confirm((points, level) => {
                    if (actions.reset.user?.id === currentUser?.id) {
                        updateUser({ points, level });
                    }
                })}
                title="Reiniciar Progreso Maestro"
                message={`¿Estás seguro de que deseas reiniciar todo el progreso de ${actions.reset.user?.first_name} ${actions.reset.user?.last_name}? Esta acción purgará sus puntos, certificados, insignias e historial de lecciones. Esta acción es monitoreada por auditoría institucional.`}
                confirmText="REINICIAR PROGRESO"
                isDestructive={true}
            />

            <ConfirmModal
                isOpen={actions.delete.isOpen}
                onClose={() => actions.delete.setOpen(false)}
                onConfirm={actions.delete.confirm}
                title="Eliminar Registro de Funcionario"
                message={`¿Estás seguro de que deseas eliminar permanentemente a ${actions.delete.user?.first_name} ${actions.delete.user?.last_name}? Esta acción es IRREVERSIBLE y eliminará todas las trazas del usuario en la plataforma de capacitación.`}
                confirmText="ELIMINAR DEFINITIVAMENTE"
                isDestructive={true}
            />
        </div>
    );
}
