import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Sub-components
import DashboardBanner from '../components/dashboard/DashboardBanner';
import ModuleGrid from '../components/dashboard/ModuleGrid';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardLoading from '../components/dashboard/DashboardLoading';
import BadgesModal from '../components/dashboard/BadgesModal';

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const { user, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API_URL}/dashboard`);
            const dashboardStats = response.data.stats || null;
            setStats(dashboardStats);
            setModules(response.data.modules || []);

            // Synchronize global stats with authStore
            if (dashboardStats) {
                updateUser({
                    points: dashboardStats.points,
                    level: dashboardStats.level
                });
            }
        } catch (error) {
            console.error('Error cargando dashboard:', error);
            navigate('/500');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardLoading />;

    return (
        <div className="space-y-4 lg:space-y-5 animate-fade-in pb-12">
            {/* Top Identity Layer (Banners & Quick Stats) */}
            <DashboardBanner
                user={user}
                stats={stats}
            />

            {/* Core Workspace Grid (Main Content & Analytics Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Primary Content: Learning Route / Learning Matrix */}
                <div className="lg:col-span-3">
                    <ModuleGrid
                        modules={modules}
                    />
                </div>

                {/* Secondary Content: Functional Status & Quick Actions */}
                <aside className="lg:col-span-1">
                    <DashboardSidebar
                        user={user}
                        stats={stats}
                        onShowBadges={() => setIsBadgesModalOpen(true)}
                    />
                </aside>
            </div>

            <BadgesModal 
                isOpen={isBadgesModalOpen}
                onClose={() => setIsBadgesModalOpen(false)}
                badges={stats?.badges || []}
            />
        </div>
    );
}
