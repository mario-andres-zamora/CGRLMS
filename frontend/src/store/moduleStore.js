import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useModuleStore = create((set, get) => ({
    modules: [],
    loading: false,
    error: null,

    fetchModules: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/modules`);
            set({ modules: response.data.modules, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.error || 'Error al obtener módulos', loading: false });
        }
    },

    fetchAdminModules: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/modules/admin/all`);
            set({ modules: response.data.modules, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.error || 'Error al obtener módulos', loading: false });
        }
    },

    createModule: async (moduleData) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`${API_URL}/modules`, moduleData);
            await get().fetchAdminModules();
            set({ loading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.error || 'Error al crear módulo', loading: false });
            return { success: false, error: error.response?.data?.error };
        }
    },

    updateModule: async (id, moduleData) => {
        set({ loading: true, error: null });
        try {
            await axios.put(`${API_URL}/modules/${id}`, moduleData);
            await get().fetchAdminModules();
            set({ loading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.error || 'Error al actualizar módulo', loading: false });
            return { success: false, error: error.response?.data?.error };
        }
    },

    deleteModule: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${API_URL}/modules/${id}`);
            await get().fetchAdminModules();
            set({ loading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.error || 'Error al eliminar módulo', loading: false });
            return { success: false, error: error.response?.data?.error };
        }
    },

    fetchModule: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/modules/${id}`);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Error al obtener el módulo', loading: false });
            return { success: false, error: error.response?.data?.error };
        }
    },

    // Resource Management
    createResource: async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/resources`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Error al crear recurso' };
        }
    },

    updateResource: async (id, formData) => {
        try {
            const response = await axios.put(`${API_URL}/resources/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Error al actualizar recurso' };
        }
    },

    deleteResource: async (id) => {
        try {
            await axios.delete(`${API_URL}/resources/${id}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Error al eliminar recurso' };
        }
    }
}));
