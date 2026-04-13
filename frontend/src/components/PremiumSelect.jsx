import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function PremiumSelect({ options, value, onChange, placeholder = "Seleccionar...", label }) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
        }
    };

    useLayoutEffect(() => {
        if (isOpen) {
            updateCoords();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('scroll', updateCoords, true);
            window.addEventListener('resize', updateCoords);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const dropdownMenu = (
        <div 
            ref={dropdownRef}
            className="fixed z-[9999] bg-[#0a1127] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in animate-slide-up backdrop-blur-3xl"
            style={{ 
                top: coords.top + 8,
                left: coords.left,
                width: coords.width,
            }}
        >
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
    );

    return (
        <div className="relative space-y-1.5 flex-1">
            {label && (
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}
            
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-slate-950/50 border-2 rounded-xl py-3 px-4 text-xs transition-all duration-300 hover:bg-slate-900/50 ${
                    isOpen 
                        ? 'border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/20' 
                        : 'border-white/5 hover:border-white/10'
                }`}
            >
                <span className={selectedOption ? "text-white font-bold" : "text-gray-500 font-medium"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-indigo-400 font-bold' : 'text-gray-600'}`} />
            </button>

            {isOpen && createPortal(dropdownMenu, document.body)}
        </div>
    );
}
