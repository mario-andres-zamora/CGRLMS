import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departments, setDepartments] = useState([]);

    // Modals & Action states
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [userToReset, setUserToReset] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

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

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/users`);
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            toast.error('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.put(`${API_URL}/users/${editingUser.id}`, editingUser);
            if (response.data.success) {
                toast.success('Usuario actualizado correctamente', { id: 'user-update' });
                setIsEditModalOpen(false);
                fetchUsers();
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.error || 'Error al actualizar el usuario';
            toast.error(msg, { id: 'user-update' });
            return false;
        }
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const response = await axios.delete(`${API_URL}/users/${userToDelete.id}`);
            if (response.data.success) {
                toast.success('Usuario eliminado permanentemente');
                fetchUsers();
                setDeleteModalOpen(false);
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.error || 'Error al eliminar el usuario';
            toast.error(msg);
            return false;
        }
    };

    const handleConfirmReset = async (onSelfReset) => {
        if (!userToReset) return;

        try {
            const response = await axios.post(`${API_URL}/users/${userToReset.id}/reset`);
            if (response.data.success) {
                toast.success('El progreso del funcionario ha sido reiniciado');
                fetchUsers();
                setResetModalOpen(false);
                
                if (onSelfReset) {
                    onSelfReset(response.data.newPoints, response.data.newLevel);
                }
                return true;
            }
        } catch (error) {
            const msg = error.response?.data?.error || 'Error al reiniciar el usuario';
            toast.error(msg);
            return false;
        }
    };

    const syncFromDirectory = async () => {
        if (!editingUser?.email) return;

        try {
            const response = await axios.get(`${API_URL}/directory`);
            if (response.data.success) {
                const directoryEntry = response.data.directory.find(d => d.email.toLowerCase() === editingUser.email.toLowerCase());
                if (directoryEntry) {
                    setEditingUser({
                        ...editingUser,
                        department: directoryEntry.department,
                        position: directoryEntry.position || editingUser.position
                    });
                    toast.success('Datos sincronizados del directorio maestro');
                } else {
                    toast.error('No se encontró al funcionario en el directorio maestro');
                }
            }
        } catch (error) {
            toast.error('Error al consultar el directorio maestro');
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    return {
        users,
        filteredUsers,
        loading,
        searchTerm,
        setSearchTerm,
        departments,
        actions: {
            edit: {
                user: editingUser,
                setUser: setEditingUser,
                isOpen: isEditModalOpen,
                setOpen: setIsEditModalOpen,
                save: handleUpdateUser,
                sync: syncFromDirectory
            },
            delete: {
                user: userToDelete,
                setUser: setUserToDelete,
                isOpen: deleteModalOpen,
                setOpen: setDeleteModalOpen,
                confirm: handleConfirmDelete
            },
            reset: {
                user: userToReset,
                setUser: setUserToReset,
                isOpen: resetModalOpen,
                setOpen: setResetModalOpen,
                confirm: handleConfirmReset
            },
            refresh: fetchUsers
        }
    };
}
