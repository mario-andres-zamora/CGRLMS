import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../hooks/useReports';
import { ReportsSkeleton } from '../components/skeletons/ReportsSkeleton';
import ReportsHeader from '../components/reports/ReportsHeader';
import ComplianceSummary from '../components/reports/ComplianceSummary';
import ComplianceCharts from '../components/reports/ComplianceCharts';
import PerformanceTable from '../components/reports/PerformanceTable';
import DistributionPie from '../components/reports/DistributionPie';
import RiskAlerts from '../components/reports/RiskAlerts';
import DetailedUserList from '../components/reports/DetailedUserList';
import CompletionTrend from '../components/reports/CompletionTrend';
import CompletionTimeChart from '../components/reports/CompletionTimeChart';
import BadgeStatsChart from '../components/reports/BadgeStatsChart';
import ComplianceDetailModal from '../components/reports/ComplianceDetailModal';
import { useState } from 'react';

export default function Reports() {
    const navigate = useNavigate();
    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        areaType: '',
        areaName: '',
        moduleId: 'ALL'
    });
    const {
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
        handleSendRiskReminders,
        handleSendIndividualRiskReminder,
        filteredUsers,
        sortedDepartments,
        refreshReports,
        selectedModuleForDept,
        setSelectedModuleForDept,
        deptModuleData,
        loadingDeptModule
    } = useReports();

    const handleBarClick = (entry) => {
        // Recharts suele envolver la data en una propiedad 'payload'
        const data = entry.payload || entry;
        
        if (chartType === 'modules') {
            setDetailModal({
                isOpen: true,
                areaType: 'all',
                areaName: data.title,
                moduleId: data.id
            });
            return;
        }

        const areaName = chartType === 'departments' ? data.department : data.position;
        if (!areaName) return;

        setDetailModal({
            isOpen: true,
            areaType: chartType,
            areaName: areaName,
            moduleId: selectedModuleForDept
        });
    };

    if (loading) {
        return <ReportsSkeleton />;
    }

    if (!reportData) return null;
    const { summary, departments, positions, atRisk, moduleCompliance, badgeStats } = reportData;

    let activeChartData = [];
    if (chartType === 'departments') {
        activeChartData = departments || [];
    } else if (chartType === 'positions') {
        activeChartData = positions || [];
    } else {
        activeChartData = moduleCompliance || [];
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
            <ReportsHeader 
                view={view}
                onToggleView={() => setView(view === 'summary' ? 'detailed' : 'summary')}
                onExport={handleExportCSV}
                onBack={() => navigate('/admin')}
                onRefresh={refreshReports}
                syncing={syncing}
            />

            {view === 'summary' ? (
                <>
                    <ComplianceSummary summary={summary} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <ComplianceCharts 
                                chartType={chartType}
                                onTypeChange={setChartType}
                                data={selectedModuleForDept === 'ALL' || chartType === 'modules' ? activeChartData : (deptModuleData || [])}
                                modules={moduleCompliance}
                                selectedModule={selectedModuleForDept}
                                onModuleChange={setSelectedModuleForDept}
                                loading={loadingDeptModule}
                                onBarClick={handleBarClick}
                            />
                        </div>

                        <div className="space-y-10">
                            <DistributionPie 
                                avgCompletion={summary.avgCompletion}
                                summary={summary}
                            />
                            
                            <CompletionTimeChart data={moduleCompliance} />
                        </div>

                        <div className="lg:col-span-2">
                            <BadgeStatsChart data={badgeStats} loading={loading} />
                        </div>

                        <div className="lg:col-span-3">
                            <CompletionTrend modules={moduleCompliance} />
                        </div>

                        <div className="lg:col-span-3">
                            <PerformanceTable 
                                departments={sortedDepartments}
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                onSort={requestSort}
                                sortConfig={sortConfig}
                            />
                        </div>

                        <div className="lg:col-span-3">
                            <RiskAlerts 
                                atRisk={atRisk}
                                departments={departments}
                                onSendReminders={handleSendReminders}
                                onSendRiskReminders={handleSendRiskReminders}
                                onSendIndividualRiskReminder={handleSendIndividualRiskReminder}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <DetailedUserList 
                    users={filteredUsers}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            )}

            <ComplianceDetailModal 
                {...detailModal} 
                onClose={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
