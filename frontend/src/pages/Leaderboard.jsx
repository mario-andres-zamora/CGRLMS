import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    Trophy,
    Medal,
    Crown,
    ShieldCheck,
    Filter,
    Award
} from 'lucide-react';
import LeaderboardSkeleton from '../components/skeletons/LeaderboardSkeleton';

// Sub-components
import LeaderboardHero from '../components/leaderboard/LeaderboardHeader';
import LeaderboardControls from '../components/leaderboard/LeaderboardControls';
import StrategicView from '../components/leaderboard/StrategicView';
import ParticipantListView from '../components/leaderboard/ParticipantListView';

const API_URL = import.meta.env.VITE_API_URL;

export default function Leaderboard() {
    const { user: loggedUser, viewAsStudent } = useAuthStore();
    const navigate = useNavigate();

    // State
    const [institutionalLeaderboard, setInstitutionalLeaderboard] = useState([]);
    const [departmentLeaderboard, setDepartmentLeaderboard] = useState([]);
    const [deptRanking, setDeptRanking] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // UI State

    const [view, setView] = useState('global');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const levels = [
        { id: 'all', name: 'Todos los niveles', icon: Filter },
        { id: 'Novato', name: 'Novato', icon: Award },
        { id: 'Iniciado', name: 'Iniciado', icon: Award },
        { id: 'Defensor', name: 'Defensor', icon: ShieldCheck },
        { id: 'Protector', name: 'Protector', icon: ShieldCheck },
        { id: 'Guardián', name: 'Guardián', icon: ShieldCheck },
        { id: 'Vigilante', name: 'Vigilante', icon: ShieldCheck },
        { id: 'Centinela', name: 'Centinela', icon: ShieldCheck },
        { id: 'Maestro Segur@', name: 'Maestro Segur@', icon: Trophy },
        { id: 'CISO Honorario', name: 'CISO Honorario', icon: Medal },
        { id: 'Leyenda Cyber', name: 'Leyenda Cyber', icon: Crown }
    ];

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/gamification/leaderboard`);
            if (response.data.success) {
                setInstitutionalLeaderboard(response.data.institutionalLeaderboard);
                setDepartmentLeaderboard(response.data.departmentLeaderboard);
                setDeptRanking(response.data.departmentRanking);
                setCurrentUser(response.data.currentUser);
            }
        } catch (error) {
            console.error('Error cargando leaderboard:', error);
            navigate('/500');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const currentList = view === 'global' ? institutionalLeaderboard : departmentLeaderboard;
    const filteredParticipants = currentList
        .filter(u => {
            const matchesSearch = `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.department?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = filterLevel === 'all' || u.level?.includes(filterLevel);
            return matchesSearch && matchesLevel;
        })
        .sort((a, b) => (a.rank_position || 9999) - (b.rank_position || 9999));

    const filteredDepts = deptRanking.filter(dept =>
        dept.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.top_performer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LeaderboardSkeleton />;

    return (
        <div className="max-w-[1400px] mx-auto space-y-4 animate-fade-in pb-20 px-4 md:px-8">
            {/* 1. Identity & Rank Showcase */}
            <LeaderboardHero currentUser={currentUser} />

            {/* 2. Operational Control Center (Tabs, Filters, Search) */}
            <LeaderboardControls
                view={view}
                setView={setView}
                levels={levels}
                filterLevel={filterLevel}
                setFilterLevel={setFilterLevel}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* 3. Dynamic Data Presentation Layer */}
            <main className="min-h-[600px] relative">
                {view === 'strategic' ? (
                    <StrategicView filteredDepts={filteredDepts} />
                ) : (
                    <ParticipantListView
                        view={view}
                        participants={filteredParticipants}
                        loggedUser={loggedUser}
                        currentUser={currentUser}
                        setView={setView}
                    />
                )}
            </main>
        </div>
    );
}
