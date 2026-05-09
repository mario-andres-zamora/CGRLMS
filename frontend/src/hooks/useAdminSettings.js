import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Award,
    Shield,
    ShieldAlert,
    Trophy,
    ChevronRight,
    ShieldCheck,
    Eye,
    Zap,
    Star,
    Crown
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export function useAdminSettings() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        levels: [],
        maintenanceMode: false,
        rankingLimitGlobal: 100,
        rankingLimitDepartment: 10,
        allowThemeChange: false
    });

    const iconMap = {
        'Award': Award,
        'Shield': Shield,
        'ShieldAlert': ShieldAlert,
        'Trophy': Trophy,
        'ChevronRight': ChevronRight,
        'ShieldCheck': ShieldCheck,
        'Eye': Eye,
        'Zap': Zap,
        'Star': Star,
        'Crown': Crown
    };

    const colorMap = {
        'Award': 'text-gray-400',
        'ChevronRight': 'text-gray-300',
        'Shield': 'text-blue-400',
        'ShieldCheck': 'text-emerald-400',
        'ShieldAlert': 'text-purple-400',
        'Eye': 'text-cyan-400',
        'Zap': 'text-yellow-400',
        'Star': 'text-orange-400',
        'Trophy': 'text-secondary-500',
        'Crown': 'text-yellow-200'
    };

    const bgColorMap = {
        'Award': 'bg-gray-400/10',
        'Shield': 'bg-blue-400/10',
        'ShieldAlert': 'bg-purple-400/10',
        'Crown': 'bg-yellow-200/10'
    };

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const [gamificationRes, systemRes] = await Promise.all([
                axios.get(`${API_URL}/gamification/settings`),
                axios.get(`${API_URL}/system/settings`)
            ]);

            if (gamificationRes.data.success) {
                const { levels } = gamificationRes.data;
                const sysSettings = systemRes.data.settings || {};
                
                setSettings({
                    levels: levels.map(l => ({
                        ...l,
                        icon: iconMap[l.icon] || Trophy,
                        iconName: l.icon,
                        color: colorMap[l.icon] || 'text-primary-500',
                        bgColor: bgColorMap[l.icon] || 'bg-primary-500/10'
                    })),
                    maintenanceMode: sysSettings.maintenance_mode === 'true',
                    rankingLimitGlobal: sysSettings.ranking_limit_global !== undefined ? parseInt(sysSettings.ranking_limit_global) : 100,
                    rankingLimitDepartment: sysSettings.ranking_limit_department !== undefined ? parseInt(sysSettings.ranking_limit_department) : 10,
                    allowThemeChange: sysSettings.allow_theme_change !== undefined ? sysSettings.allow_theme_change === 'true' : false
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Error al cargar configuraciones del sistema');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateLevel = (index, minPoints) => {
        const newLevels = [...settings.levels];
        newLevels[index].minPoints = parseInt(minPoints) || 0;
        setSettings(prev => ({ ...prev, levels: newLevels }));
    };

    const toggleMaintenance = () => {
        setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    };

    const updateRankingLimit = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const toggleThemeChange = () => {
        setSettings(prev => ({ ...prev, allowThemeChange: !prev.allowThemeChange }));
    };

    const saveSettings = async () => {
        setSaving(true);
        const payload = {
            levels: settings.levels.map(l => ({
                name: l.name,
                minPoints: l.minPoints,
                icon: l.iconName || 'Award'
            }))
        };

        toast.promise(
            Promise.all([
                axios.put(`${API_URL}/gamification/settings`, payload),
                axios.put(`${API_URL}/system/settings`, {
                    maintenance_mode: settings.maintenanceMode,
                    ranking_limit_global: settings.rankingLimitGlobal,
                    ranking_limit_department: settings.rankingLimitDepartment,
                    allow_theme_change: settings.allowThemeChange
                })
            ]),
            {
                loading: 'Guardando configuraciones...',
                success: 'Configuraciones guardadas permanentemente',
                error: 'Error al salvar cambios'
            }
        ).then(() => {
            fetchSettings();
        }).finally(() => setSaving(false));
    };

    const refreshLeaderboard = async () => {
        setSaving(true);
        const toastId = toast.loading('Recalculando ranking global...', { id: 'sync-leaderboard' });
        try {
            const response = await axios.post(`${API_URL}/gamification/leaderboard/refresh`);
            if (response.data.success) {
                toast.success('Ranking recalculado con éxito', { id: 'sync-leaderboard' });
            } else {
                throw new Error('Sync failed');
            }
        } catch (error) {
            toast.error('Error al sincronizar ranking', { id: 'sync-leaderboard' });
        } finally {
            setSaving(false);
        }
    };

    return {
        settings,
        loading,
        saving,
        updateLevel,
        toggleMaintenance,
        updateRankingLimit,
        toggleThemeChange,
        saveSettings,
        refreshLeaderboard,
        refresh: fetchSettings
    };
}
