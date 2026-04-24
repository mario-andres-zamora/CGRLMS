import React from 'react';
import { motion } from 'framer-motion';

export default function LoginHeader() {
    return (
        <div className="flex flex-col items-center text-center gap-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="w-48 h-48 md:w-56 md:h-56 relative flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
                <img
                    src="/images/logo-cgr-blanco.webp"
                    alt="CGR Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)] relative z-10"
                />
            </motion.div>

            <div className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none"
                >
                    Modelo Integrado de Aprendizaje<span className="text-secondary-500"> (MIA)</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs"
                >
                    Contraloría General de la República
                </motion.p>
            </div>
        </div>
    );
}
