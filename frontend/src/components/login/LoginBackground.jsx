import React from 'react';
import { motion } from 'framer-motion';
import CyberCat from '../CyberCat';

export default function LoginBackground() {
    // Generar partículas aleatorias
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5
    }));

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Base Background Gradient */}
            <div className="absolute inset-0 bg-[#1e2648]"></div>

            {/* Glowing Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/25 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/15 rounded-full blur-[120px]"></div>

            {/* Moving Grid - Infinite Scrolling */}
            <motion.div
                className="absolute inset-0 opacity-[0.07]"
                initial={{ backgroundPosition: '0px 0px' }}
                animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                                     linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Data Particles / Stars */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-primary-400"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        opacity: 0.3
                    }}
                    animate={{
                        x: [0, -100, 0, 100, 0],
                        y: [0, 50, 0, -50, 0],
                        opacity: [0.1, 0.5, 0.1]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Flying CyberCat */}
            <motion.div
                className="absolute z-20"
                initial={{ x: '-20vw', y: '20vh', rotate: 10 }}
                animate={{
                    x: ['-20vw', '120vw'],
                    y: ['20vh', '40vh', '15vh', '30vh'],
                    rotate: [10, 5, 15, 10]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <div className="relative">
                    {/* Shadow/Glow behind the cat */}
                    <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full scale-125"></div>
                    <CyberCat className="w-32 h-32" color="#28a9e0" />
                </div>
            </motion.div>

            {/* Another CyberCat further away */}
            <motion.div
                className="absolute z-10 opacity-40 scale-50"
                initial={{ x: '120vw', y: '60vh', rotate: -15 }}
                animate={{
                    x: ['120vw', '-20vw'],
                    y: ['60vh', '40vh', '70vh', '60vh'],
                    rotate: [-15, -10, -20, -15]
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5
                }}
            >
                <CyberCat className="w-24 h-24" color="#E57B3C" />
            </motion.div>

            {/* Scanner line effect */}
            <motion.div
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-400/30 to-transparent z-10"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* HUD Elements */}
            <div className="absolute inset-0 z-20 opacity-20 pointer-events-none">
                {/* Top Left */}
                <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-primary-400/50 rounded-tl-xl"></div>
                <div className="absolute top-14 left-14 text-[8px] font-mono text-primary-400 uppercase tracking-[0.2em]">
                    System Status: Secure<br />
                    Encryption: Active
                </div>

                {/* Top Right */}
                <div className="absolute top-10 right-10 w-24 h-24 border-t-2 border-r-2 border-primary-400/50 rounded-tr-xl"></div>
                <div className="absolute top-14 right-14 text-right text-[8px] font-mono text-primary-400 uppercase tracking-[0.2em]">
                    User: Unauthorized<br />
                    Access: Pending...
                </div>

                {/* Bottom Left */}
                <div className="absolute bottom-10 left-10 w-24 h-24 border-b-2 border-l-2 border-primary-400/50 rounded-bl-xl"></div>

                {/* Bottom Right */}
                <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-primary-400/50 rounded-br-xl"></div>
            </div>
        </div>
    );
}
