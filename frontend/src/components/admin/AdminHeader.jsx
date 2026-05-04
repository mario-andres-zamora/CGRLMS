import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AdminHeader({ title, subtitle, showBack = true }) {
    const navigate = useNavigate();

    return (
        <div className="space-y-4 mb-10 text-left">
            {showBack && (
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Panel Admin
                </button>
            )}
            <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase italic">
                    {title || 'Panel de Administración'}
                </h1>
                <p className="text-gray-400 font-medium text-sm">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
