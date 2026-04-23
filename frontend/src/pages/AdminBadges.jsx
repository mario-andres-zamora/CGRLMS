import { useBadges } from '../hooks/useBadges';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import ConfirmModal from '../components/ConfirmModal';

// Modular Components
import BadgeHeader from '../components/admin/badges/BadgeHeader';
import BadgeGrid from '../components/admin/badges/BadgeGrid';
import BadgeEditModal from '../components/admin/badges/BadgeEditModal';
import BadgeAwardModal from '../components/admin/badges/BadgeAwardModal';

export default function AdminBadges() {
    const navigate = useNavigate();
    const { 
        loading, 
        filteredBadges, 
        searchTerm, 
        setSearchTerm, 
        isModalOpen, 
        setIsModalOpen, 
        isDeleteModalOpen, 
        isAwardModalOpen,
        badgeToAward,
        formData, 
        setFormData, 
        editingBadge, 
        badgeToDelete, 
        actions 
    } = useBadges();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
                <div className="flex justify-between items-center text-left">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-64" />
                    </div>
                    <Skeleton className="h-14 w-48 rounded-2xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <BadgeHeader 
                onBack={() => navigate('/admin')}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onCreate={actions.openCreate}
            />

            {/* Badges Grid */}
            <BadgeGrid 
                badges={filteredBadges}
                onEdit={actions.openEdit}
                onDelete={actions.delete.open}
                onAward={actions.award.open}
            />

            {/* Edit Modal */}
            <BadgeEditModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingBadge={editingBadge}
                formData={formData}
                setFormData={setFormData}
                onSave={actions.save}
            />

            {/* Confirm Deletion */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={actions.delete.close}
                onConfirm={actions.delete.confirm}
                title="Eliminar Insignia"
                message={`¿Estás seguro de que deseas eliminar la insignia "${badgeToDelete?.name}"? Los funcionarios que ya la han ganado la conservarán en su perfil, pero ya no podrá ser otorgada a nuevos usuarios.`}
                confirmText="Eliminar permanentemente"
                isDestructive={true}
            />

            {/* Award Modal */}
            <BadgeAwardModal
                isOpen={isAwardModalOpen}
                onClose={actions.award.close}
                badge={badgeToAward}
                onAward={actions.award.submit}
            />
        </div>
    );
}
