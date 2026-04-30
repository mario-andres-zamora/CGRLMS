import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export function useDirectory() {
    const [directory, setDirectory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    const [departments, setDepartments] = useState([]);

    const [editingRecord, setEditingRecord] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newRecord, setNewRecord] = useState({ full_name: '', email: '', department: '', position: '' });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter/Sort
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'asc' });

    useEffect(() => {
        fetchDirectory();
        fetchDepartments();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterDepartment, filterStatus]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${API_URL}/departments`);
            if (response.data.success) {
                setDepartments(response.data.departments);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchDirectory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/directory`);
            if (response.data.success) {
                setDirectory(response.data.directory);
            }
        } catch (error) {
            toast.error('Error al cargar el directorio maestro');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('csv', file);

        try {
            setUploading(true);
            const response = await axios.post(`${API_URL}/directory/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchDirectory();
                return true;
            }
        } catch (error) {
            toast.error('Error al subir el archivo');
            return false;
        } finally {
            setUploading(false);
            event.target.value = null;
        }
    };

    const handleConfirmDelete = async () => {
        if (!recordToDelete) return;
        try {
            await axios.delete(`${API_URL}/directory/${recordToDelete.id}`);
            toast.success('Registro eliminado');
            fetchDirectory();
            setDeleteModalOpen(false);
            setRecordToDelete(null);
            return true;
        } catch (error) {
            toast.error('Error al eliminar');
            return false;
        }
    };

    const handleUpdateRecord = async () => {
        try {
            const response = await axios.put(`${API_URL}/directory/${editingRecord.id}`, editingRecord);
            if (response.data.success) {
                toast.success('Registro actualizado');
                setIsEditModalOpen(false);
                fetchDirectory();
                return true;
            }
        } catch (error) {
            toast.error('Error al actualizar');
            return false;
        }
    };

    const handleCreateRecord = async () => {
        if (!newRecord.email || !newRecord.full_name) {
            toast.error('Email y Nombre son requeridos');
            return false;
        }
        try {
            const response = await axios.post(`${API_URL}/directory/single`, newRecord);
            if (response.data.success) {
                toast.success('Funcionario agregado');
                setIsAddModalOpen(false);
                setNewRecord({ full_name: '', email: '', department: '', position: '' });
                fetchDirectory();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al agregar');
            return false;
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get(`${API_URL}/directory/template`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'plantilla_directorio_cgr.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Error al descargar la plantilla');
        }
    };

    const handleSendInvite = async (person) => {
        try {
            const response = await axios.post(`${API_URL}/directory/invite`, {
                email: person.email,
                full_name: person.full_name
            });
            if (response.data.success) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error('Error al enviar la invitación');
        }
    };

    const filteredDirectory = useMemo(() => {
        let result = directory.filter(person => {
            const matchesSearch = person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (person.department && person.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (person.position && person.position.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDepartment = !filterDepartment || person.department === filterDepartment;
            const matchesStatus = !filterStatus ||
                (filterStatus === 'registered' ? person.is_registered : !person.is_registered);

            return matchesSearch && matchesDepartment && matchesStatus;
        });

        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key] || '';
                let bValue = b[sortConfig.key] || '';

                if (sortConfig.key === 'is_registered') {
                    aValue = a.is_registered ? 1 : 0;
                    bValue = b.is_registered ? 1 : 0;
                }

                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [directory, searchTerm, filterDepartment, filterStatus, sortConfig]);

    const stats = useMemo(() => ({
        total: directory.length,
        registered: directory.filter(p => p.is_registered).length,
        pending: directory.filter(p => !p.is_registered).length
    }), [directory]);

    // Pagination derived data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDirectory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDirectory.length / itemsPerPage);

    return {
        directory,
        filteredDirectory,
        currentItems,
        stats,
        loading,
        uploading,
        searchTerm,
        setSearchTerm,
        filterDepartment,
        setFilterDepartment,
        filterStatus,
        setFilterStatus,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        sortConfig,
        setSortConfig,
        departments,
        editingRecord,
        setEditingRecord,
        newRecord,
        setNewRecord,
        modals: {
            add: { isOpen: isAddModalOpen, setOpen: setIsAddModalOpen },
            edit: { isOpen: isEditModalOpen, setOpen: setIsEditModalOpen },
            delete: { isOpen: deleteModalOpen, setOpen: setDeleteModalOpen, record: recordToDelete, setRecord: setRecordToDelete }
        },
        actions: {
            upload: handleFileUpload,
            delete: handleConfirmDelete,
            update: handleUpdateRecord,
            create: handleCreateRecord,
            sendInvite: handleSendInvite,
            downloadTemplate: handleDownloadTemplate,
            refresh: fetchDirectory,
            sort: (key) => {
                let direction = 'asc';
                if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
                setSortConfig({ key, direction });
            }
        },
        indexOfFirstItem,
        indexOfLastItem
    };
}
