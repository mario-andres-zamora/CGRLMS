import React, { useState } from 'react';
import { User, X, ShieldCheck, Activity, Building2, RefreshCcw, Briefcase, ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ label, value, options, onChange, icon: Icon, placeholder = 'Seleccionar...' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value) || options.find(opt => opt.value === String(value));

    return (
        <div className="space-y-2 relative">
            {label && <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">{label}</label>}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between bg-[#0a0d18] border rounded-xl py-4 transition-all duration-300 group-hover/btn:border-white/10 ${isOpen ? 'border-primary-500/50 shadow-lg shadow-primary-500/5' : 'border-white/5 shadow-inner'} ${Icon ? 'pl-12 pr-5' : 'px-5'}`}
                >
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-hover:text-primary-500/50">
                                <Icon className="w-4 h-4" />
                            </div>
                        )}
                        <span className={`text-sm font-bold truncate ${selectedOption ? 'text-gray-200' : 'text-gray-600'}`}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#161b2e] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all group/opt ${value === opt.value ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span>{opt.label}</span>
                                        {value === opt.value && <Check className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default function UserEditModal({ user, departments, isOpen, onClose, onUpdate, onSave, onSync }) {
    if (!isOpen || !user) return null;

    const roleOptions = [
        { value: 'student', label: 'Usuario (Funcionario)' },
        { value: 'admin', label: 'Administrador (TI/Seguridad)' }
    ];

    const statusOptions = [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo / Bloqueado' }
    ];

    // Normalizar is_active para que el CustomSelect lo encuentre sin importar si viene como bool, int o string
    const normalizedStatus = user.is_active === true || user.is_active === 1 || user.is_active === 'true' || user.is_active === '1' ? 'true' : 'false';

    const departmentOptions = departments.map(d => ({
        value: d.name,
        label: d.name
    }));

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
            <div className="bg-[#121625] w-full max-w-xl p-0 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-white/5 rounded-3xl">
                {/* Header Section */}
                <div className="px-8 py-8 border-b border-white/5 flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Editar Funcionario</h2>
                        <p className="text-gray-400 text-sm font-medium">{user.first_name} {user.last_name}</p>
                    </div>
                    <button
                        onClick={onSync}
                        className="group flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-gray-500 hover:text-primary-400 min-w-[140px]"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center leading-tight transition-colors">
                            Sincronizar<br/>Directorio
                        </span>
                    </button>
                </div>

                {/* Form Selection */}
                <div className="px-8 py-10 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <CustomSelect
                            label="Rol en Sistema"
                            value={user.role}
                            options={roleOptions}
                            onChange={(val) => onUpdate({ ...user, role: val })}
                        />
                        <CustomSelect
                            label="Estado"
                            value={normalizedStatus}
                            options={statusOptions}
                            onChange={(val) => onUpdate({ ...user, is_active: val === 'true' })}
                        />
                    </div>

                    <CustomSelect
                        label="Unidad Administrativa / Área"
                        value={user.department}
                        options={departmentOptions}
                        onChange={(val) => onUpdate({ ...user, department: val })}
                        icon={Building2}
                        placeholder="Seleccionar área oficial..."
                    />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block">Cargo Institucional</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-primary-500/50 transition-colors font-black">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                name="position"
                                value={user.position || ''}
                                onChange={(e) => onUpdate({ ...user, position: e.target.value })}
                                className="w-full bg-[#0a0d18] border border-white/5 hover:border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm text-gray-200 font-bold focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-800 uppercase tracking-tight shadow-inner"
                                placeholder="Puesto o Cargo"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-8 py-10 bg-slate-900/10 flex items-center justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-10 py-4 bg-transparent text-gray-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all rounded-xl"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all rounded-xl shadow-lg shadow-primary-500/10 active:scale-95"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
