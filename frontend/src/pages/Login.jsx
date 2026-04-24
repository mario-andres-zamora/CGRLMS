import React from 'react';
import { motion } from 'framer-motion';
import { useLogin } from '../hooks/useLogin';
import LoginBackground from '../components/login/LoginBackground';
import LoginHeader from '../components/login/LoginHeader';
import LoginCard from '../components/login/LoginCard';
import LoginFooter from '../components/login/LoginFooter';

export default function Login() {
    const { googleLogin, isLoading } = useLogin();

    return (
        <div className="min-h-screen flex flex-col bg-[#1e2648] relative overflow-hidden">
            <LoginBackground />

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-xl flex flex-col items-center gap-10"
                >
                    <LoginHeader />
                    <LoginCard onLogin={() => googleLogin()} isLoading={isLoading} />
                </motion.div>
            </div>

            <LoginFooter />
        </div>
    );
}
