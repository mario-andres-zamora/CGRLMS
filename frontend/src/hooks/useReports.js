import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export function useReports() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('summary');
    const [chartType, setChartType] = useState('departments');
    const [selectedModuleForDept, setSelectedModuleForDept] = useState('ALL');
    const [deptModuleData, setDeptModuleData] = useState(null);
    const [loadingDeptModule, setLoadingDeptModule] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'avg_completion', direction: 'desc' });

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (chartType === 'departments' && selectedModuleForDept !== 'ALL') {
            fetchDeptModuleCompliance();
        }
    }, [selectedModuleForDept, chartType]);

    const fetchDeptModuleCompliance = async () => {
        try {
            setLoadingDeptModule(true);
            const response = await axios.get(`${API_URL}/reports/department-compliance?module_id=${selectedModuleForDept}`);
            if (response.data.success) {
                setDeptModuleData(response.data.departments);
            }
        } catch (error) {
            toast.error('Error al cargar cumplimiento específico');
        } finally {
            setLoadingDeptModule(false);
        }
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/reports/compliance`);
            if (response.data.success) {
                setReportData(response.data);
            }
        } catch (error) {
            toast.error('Error al cargar reportes gerenciales');
        } finally {
            setLoading(false);
        }
    };

    const refreshReports = async () => {
        setSyncing(true);
        const toastId = toast.loading('Sincronizando analytics...', { id: 'sync-reports' });
        try {
            const response = await axios.post(`${API_URL}/reports/compliance/refresh`);
            if (response.data.success) {
                setReportData(response.data);
                toast.success('Reportes actualizados correctamente', { id: 'sync-reports' });
            } else {
                throw new Error('Sync failed');
            }
        } catch (error) {
            toast.error('Error al sincronizar reportes', { id: 'sync-reports' });
        } finally {
            setSyncing(false);
        }
    };

    const handleExportCSV = () => {
        if (!reportData?.detailedUsers) return;

        const headers = ["ID", "Funcionario", "Email", "Unidad", "Puesto", "Progreso %", "Módulos Completados"];
        const rows = reportData.detailedUsers.map(u => [
            u.id,
            `${u.first_name} ${u.last_name}`,
            u.email,
            u.department,
            u.position,
            `${u.progress}%`,
            `${u.completed_modules}/${u.total_modules}`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_cumplimiento_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSendReminders = async (department) => {
        if (!department) {
            toast.error('Por favor selecciona una unidad primero');
            return;
        }

        const toastId = toast.loading(`Enviando invitaciones a la unidad: ${department}...`);
        try {
            const response = await axios.post(`${API_URL}/reports/remind-unregistered`, { department });
            if (response.data.success) {
                toast.success(response.data.message, { id: toastId, duration: 5000 });
            } else {
                throw new Error(response.data.error || 'Error desconocido');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al enviar invitaciones masivas', { id: toastId });
        }
    };

    const filteredUsers = useMemo(() => {
        if (!reportData?.detailedUsers) return [];
        return reportData.detailedUsers.filter(u =>
            `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [reportData, searchTerm]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedDepartments = useMemo(() => {
        if (!reportData?.departments) return [];
        let sortableItems = [...reportData.departments];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [reportData, sortConfig]);

    return {
        reportData,
        loading,
        syncing,
        searchTerm,
        setSearchTerm,
        view,
        setView,
        chartType,
        setChartType,
        sortConfig,
        requestSort,
        handleExportCSV,
        handleSendReminders,
        filteredUsers,
        sortedDepartments,
        refreshReports,
        selectedModuleForDept,
        setSelectedModuleForDept,
        deptModuleData,
        loadingDeptModule
    };
}
