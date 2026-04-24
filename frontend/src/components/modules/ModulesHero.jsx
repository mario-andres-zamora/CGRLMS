import React from 'react';
import primaryBanner from '../../assets/primary-banner.svg';

export default function ModulesHero() {
    return (
        <div className="relative rounded-[2rem] overflow-hidden bg-slate-800/20 border border-white/5 shadow-2xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={primaryBanner}
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#161b33] via-[#161b33]/80 to-transparent"></div>
            </div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="space-y-4 max-w-2xl text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        Ruta de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">Aprendizaje</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-medium max-w-lg">
                        Explora los contenidos diseñados para fortalecer tu conocimiento en ciberseguridad.
                    </p>
                </div>
            </div>
        </div>
    );
}
