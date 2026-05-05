import { useNavigate } from 'react-router-dom';
import PremiumSelect from '../components/PremiumSelect';
import ConfirmModal from '../components/ConfirmModal';
import { TableSkeleton } from '../components/skeletons/TableSkeleton';
import Skeleton from '../components/Skeleton';
import { useDirectory } from '../hooks/useDirectory';

// Modular Components
import DirectoryHeader from '../components/admin/directory/DirectoryHeader';
import DirectoryStats from '../components/admin/directory/DirectoryStats';
import DirectoryFilters from '../components/admin/directory/DirectoryFilters';
import DirectoryTable from '../components/admin/directory/DirectoryTable';
import DirectoryPagination from '../components/admin/directory/DirectoryPagination';

export default function AdminDirectory() {
    const navigate = useNavigate();
    const {
        filteredDirectory,
        currentItems,
        stats,
        loading,
        uploading,
        searchTerm,
        setSearchTerm,
        filterDepartment,
        setFilterDepartment,
        filterStatus,
        setFilterStatus,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        sortConfig,
        departments,
        editingRecord,
        setEditingRecord,
        newRecord,
        setNewRecord,
        modals,
        actions,
        indexOfFirstItem,
        indexOfLastItem
    } = useDirectory();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
                <div className="flex justify-between items-center text-left">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-64" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-32 rounded-xl" />
                        <Skeleton className="h-12 w-32 rounded-xl" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                </div>
                <TableSkeleton rows={8} cols={5} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <DirectoryHeader 
                onBack={() => navigate('/admin')}
                onAdd={() => modals.add.setOpen(true)}
                onUpload={actions.upload}
                onDownloadTemplate={actions.downloadTemplate}
                uploading={uploading}
            />

            {/* Stats Dashboard */}
            <DirectoryStats stats={stats} />

            {/* Filter & Search */}
            <DirectoryFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterDepartment={filterDepartment}
                onDepartmentChange={setFilterDepartment}
                filterStatus={filterStatus}
                onStatusChange={setFilterStatus}
                departments={departments}
            />

            {/* List */}
            <DirectoryTable 
                items={currentItems}
                sortConfig={sortConfig}
                onSort={actions.sort}
                onEdit={(person) => { setEditingRecord({ ...person }); modals.edit.setOpen(true); }}
                onDelete={(person) => { modals.delete.setRecord(person); modals.delete.setOpen(true); }}
                onSendInvite={actions.sendInvite}
            />

            {/* Pagination Controls */}
            <DirectoryPagination 
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                totalItems={filteredDirectory.length}
            />

            {/* Add Record Modal */}
            {modals.add.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="card w-full max-w-2xl !p-0 overflow-hidden border-white/10 shadow-[0_0_100px_rgba(249,115,22,0.15)] text-left">
                        <div className="p-10 border-b border-white/5 bg-white/5">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Agregar Funcionario</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2 px-1">Ingresa los datos del nuevo funcionario autorizado.</p>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">Email Institucional</label>
                                <input type="email" value={newRecord.email} onChange={(e) => setNewRecord({ ...newRecord, email: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary-500 transition-all font-bold" placeholder="ejemplo@cgr.go.cr" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">Nombre Completo</label>
                                <input type="text" value={newRecord.full_name} onChange={(e) => setNewRecord({ ...newRecord, full_name: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary-500 transition-all font-bold" placeholder="JUAN PEREZ ZAMORA..." />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <PremiumSelect
                                        label="Unidad Administrativa"
                                        options={departments.map(d => ({ value: d.name, label: d.name }))}
                                        value={newRecord.department}
                                        onChange={(val) => setNewRecord({ ...newRecord, department: val })}
                                        placeholder="Seleccionar..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">Cargo</label>
                                    <input type="text" value={newRecord.position} onChange={(e) => setNewRecord({ ...newRecord, position: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary-500 transition-all font-bold" placeholder="TECNICO..." />
                                </div>
                            </div>
                        </div>
                        <div className="p-10 bg-slate-950/50 border-t border-white/5 flex gap-6">
                            <button onClick={() => modals.add.setOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Cancelar</button>
                            <button onClick={actions.create} className="flex-1 py-4 bg-secondary-500 rounded-2xl text-[10px] font-black uppercase text-white shadow-xl shadow-secondary-500/20 hover:bg-secondary-400 hover:scale-[1.02] transition-all">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Record Modal */}
            {modals.edit.isOpen && editingRecord && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
                    <div className="card w-full max-w-2xl !p-0 overflow-hidden border-white/10 shadow-[0_0_100px_rgba(56,74,153,0.15)]">
                        <div className="p-10 border-b border-white/5 bg-white/5">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Editar Registro</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2 px-1">Actualizando datos de <span className="text-primary-400">{editingRecord.email}</span></p>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">Email Institucional</label>
                                <input type="email" value={editingRecord.email} onChange={(e) => setEditingRecord({ ...editingRecord, email: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary-500 transition-all font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">Nombre Completo</label>
                                <input type="text" value={editingRecord.full_name} onChange={(e) => setEditingRecord({ ...editingRecord, full_name: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary-500 transition-all font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <PremiumSelect
                                        label="Unidad Administrativa"
                                        options={departments.map(d => ({ value: d.name, label: d.name }))}
                                        value={editingRecord.department}
                                        onChange={(val) => setEditingRecord({ ...editingRecord, department: val })}
                                        placeholder="Seleccionar..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">Cargo</label>
                                    <input type="text" value={editingRecord.position} onChange={(e) => setEditingRecord({ ...editingRecord, position: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary-500 transition-all font-bold" />
                                </div>
                            </div>
                        </div>
                        <div className="p-10 bg-slate-950/50 border-t border-white/5 flex gap-6">
                            <button onClick={() => modals.edit.setOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">Cancelar</button>
                            <button onClick={actions.update} className="flex-1 py-4 bg-primary-500 rounded-2xl text-[10px] font-black uppercase text-white shadow-xl shadow-primary-500/20 hover:bg-primary-400 hover:scale-[1.02] transition-all">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={modals.delete.isOpen}
                onClose={() => modals.delete.setOpen(false)}
                onConfirm={actions.delete}
                title="Eliminar Registro"
                message={`¿Seguro que deseas eliminar a ${modals.delete.record?.full_name || 'este usuario'} del directorio maestro?`}
                confirmText="Eliminar permanentemente"
                isDestructive={true}
            />
        </div>
    );
}
