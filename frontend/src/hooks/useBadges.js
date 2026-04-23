import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export function useBadges() {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: 'inicio-seguridad.svg',
        icon_name: 'Award', // kept for safety, but UI will use image_url
        criteria_type: 'manual',
        criteria_value: null,
        points: 10
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [badgeToDelete, setBadgeToDelete] = useState(null);

    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [badgeToAward, setBadgeToAward] = useState(null);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/badges`);
            if (response.data.success) {
                setBadges(response.data.badges);
            }
        } catch (error) {
            toast.error('Error al cargar insignias');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!formData.name || !formData.description) {
                toast.error('Nombre y descripción son obligatorios');
                return false;
            }

            if (editingBadge) {
                await axios.put(`${API_URL}/badges/${editingBadge.id}`, formData);
                toast.success('Insignia actualizada');
            } else {
                await axios.post(`${API_URL}/badges`, formData);
                toast.success('Insignia creada');
            }

            setIsModalOpen(false);
            setEditingBadge(null);
            setFormData({ 
                name: '', 
                description: '', 
                image_url: 'inicio-seguridad.svg', 
                icon_name: 'Award', 
                criteria_type: 'manual', 
                criteria_value: null,
                points: 10
            });
            fetchBadges();
            return true;
        } catch (error) {
            toast.error('Error al guardar la insignia');
            return false;
        }
    };

    const handleDelete = async () => {
        if (!badgeToDelete) return;

        try {
            await axios.delete(`${API_URL}/badges/${badgeToDelete.id}`);
            toast.success('Insignia eliminada');
            setIsDeleteModalOpen(false);
            setBadgeToDelete(null);
            fetchBadges();
            return true;
        } catch (error) {
            toast.error('Error al eliminar insignia');
            return false;
        }
    };

    const handleAward = async (badgeId, email) => {
        try {
            const response = await axios.post(`${API_URL}/badges/award-by-email`, { email, badgeId });
            toast.success(response.data.message || 'Insignia otorgada correctamente');
            setIsAwardModalOpen(false);
            setBadgeToAward(null);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al otorgar la insignia');
            return false;
        }
    };

    const filteredBadges = useMemo(() => {
        return badges.filter(b =>
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [badges, searchTerm]);

    const openCreateModal = () => {
        setEditingBadge(null);
        setFormData({ 
            name: '', 
            description: '', 
            image_url: 'inicio-seguridad.svg', 
            icon_name: 'Award', 
            criteria_type: 'manual', 
            criteria_value: null,
            points: 10
        });
        setIsModalOpen(true);
    };

    const openEditModal = (badge) => {
        setEditingBadge(badge);
        setFormData({ ...badge });
        setIsModalOpen(true);
    };

    return {
        badges,
        filteredBadges,
        loading,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isAwardModalOpen,
        badgeToAward,
        formData,
        setFormData,
        editingBadge,
        badgeToDelete,
        actions: {
            save: handleSave,
            delete: {
                confirm: handleDelete,
                open: (badge) => {
                    setBadgeToDelete(badge);
                    setIsDeleteModalOpen(true);
                },
                close: () => {
                    setBadgeToDelete(null);
                    setIsDeleteModalOpen(false);
                }
            },
            award: {
                open: (badge) => {
                    setBadgeToAward(badge);
                    setIsAwardModalOpen(true);
                },
                close: () => {
                    setBadgeToAward(null);
                    setIsAwardModalOpen(false);
                },
                submit: handleAward
            },
            refresh: fetchBadges,
            openCreate: openCreateModal,
            openEdit: openEditModal
        }
    };
}
