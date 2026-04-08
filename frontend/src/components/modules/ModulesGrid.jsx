import React from 'react';
import { Search } from 'lucide-react';
import ModuleCard from './ModuleCard';

export default function ModulesGrid({ modules, user, viewAsStudent }) {
    if (modules.length === 0) {
        return (
            <div className="col-span-full py-24 text-center">
                <div className="w-24 h-24 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-white/10">
                    <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No se encontraron resultados</h3>
                <p className="text-gray-500">Intenta ajustar los términos de búsqueda.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 auto-rows-fr">
            {modules.map((module) => (
                <ModuleCard 
                    key={module.id} 
                    module={module} 
                    user={user} 
                    viewAsStudent={viewAsStudent} 
                />
            ))}
        </div>
    );
}
