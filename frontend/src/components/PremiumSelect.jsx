import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function PremiumSelect({ options, value, onChange, placeholder = "Seleccionar...", label }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative space-y-1.5 flex-1" ref={dropdownRef}>
            {label && (
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                    {label}
                </label>
            )}
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-[#0a0d18] border rounded-xl py-3 px-4 text-sm transition-all duration-300 hover:bg-slate-900/50 ${
                    isOpen 
                        ? 'border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/20' 
                        : 'border-white/5 hover:border-white/10'
                }`}
            >
                <span className={selectedOption ? "text-white font-semibold" : "text-gray-500 font-medium"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-indigo-400 font-bold' : 'text-gray-600'}`} />
            </button>

            {isOpen && (
                <div className="absolute z-[200] w-full mt-2 bg-[#0a0d18] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in animate-slide-up backdrop-blur-3xl">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                        {options.map((option) => (
                            <button
                                key={option.id || option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-3 text-[13px] rounded-xl transition-all duration-200 mb-1 last:mb-0 group/opt ${
                                    value === option.value
                                        ? 'bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <span className={`flex-1 text-left ${value === option.value ? 'translate-x-1' : 'group-hover/opt:translate-x-1'} transition-transform duration-300`}>{option.label}</span>
                                {value === option.value && (
                                    <Check className="w-3.5 h-3.5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] animate-in zoom-in duration-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
