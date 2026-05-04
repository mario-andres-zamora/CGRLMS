import React, { useState } from 'react';
import { ArrowLeft, Search, Building2, ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ value, options, onChange, icon: Icon, placeholder = 'Seleccionar...' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value) || options.find(opt => opt.value === String(value));

    return (
        <div className="relative group w-full h-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-full flex items-center justify-between bg-slate-900/50 border hover:border-white/10 rounded-2xl py-3 transition-all duration-300 ${isOpen ? 'border-white/20' : 'border-white/5 shadow-inner'} ${Icon ? 'pl-11 pr-4' : 'px-5'}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                        </div>
                    )}
                    <span className={`text-sm font-medium truncate ${selectedOption ? 'text-white' : 'text-gray-500'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 md:min-w-[400px] right-0 mt-2 z-50 bg-[#161b2e] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="max-h-80 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all hover:bg-white/5 ${value === opt.value ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <span className="text-left leading-relaxed">{opt.label}</span>
                                    {value === opt.value && <Check className="w-3.5 h-3.5 text-white flex-shrink-0 ml-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default function UserHeader({
    searchTerm,
    onSearchChange,
    departments,
    departmentFilter,
    onDepartmentChange,
    onBack
}) {
    const departmentOptions = [
        { value: 'ALL', label: 'TODAS LAS UNIDADES' },
        ...(departments || []).map(dept => ({
            value: dept.name || dept,
            label: dept.name || dept
        }))
    ];

    return (
        <div className="flex flex-col items-start gap-8 text-left mb-6">
            <div className="space-y-4 w-full">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> VOLVER AL PANEL ADMIN
                </button>

                <div>
                    <h1 className="text-3xl md:text-[40px] font-black text-white uppercase tracking-tight leading-none mb-2 whitespace-nowrap">
                        GESTIÓN DE USUARIOS
                    </h1>
                    <p className="text-sm font-medium text-gray-400">
                        Control de acceso y roles de usuarios
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4 max-w-5xl text-left">
                <div className="w-full md:w-[30%]">
                    <div className="relative group h-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                            id="user-search-input"
                            name="user-search"
                            type="text"
                            autoComplete="off"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full h-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-500 shadow-inner"
                        />
                    </div>
                </div>
                <div className="w-full md:w-[70%] min-h-[46px]">
                    <CustomSelect
                        value={departmentFilter}
                        options={departmentOptions}
                        onChange={onDepartmentChange}
                        icon={Building2}
                        placeholder="Filtrar por unidad"
                    />
                </div>
            </div>
        </div>
    );
}
