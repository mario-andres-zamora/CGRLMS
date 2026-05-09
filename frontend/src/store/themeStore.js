import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create()(
    persist(
        (set) => ({
            theme: 'dark', // 'dark' o 'light'
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'dark' ? 'light' : 'dark'
            })),
        }),
        {
            name: 'theme-preference', // nombre de la key en localStorage
        }
    )
);
