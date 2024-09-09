import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
    email: string;
    darkMode: boolean;
    fontSize: number;
    accentColor: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    privacy: {
        twoFactorAuth: boolean;
    };
    security: {
        recentLoginActivity: boolean;
    };
    language: string;
    timeZone: string;
    setSettings: (settings: Partial<SettingsState>) => void;
}

const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            email: '',
            darkMode: false,
            fontSize: 16,
            accentColor: '#007bff',
            notifications: {
                email: true,
                push: true,
                sms: true,
            },
            privacy: {
                twoFactorAuth: true,
            },
            security: {
                recentLoginActivity: true,
            },
            language: 'en',
            timeZone: 'UTC',
            setSettings: (settings) => set((state) => ({
                ...state,
                ...settings,
            })),
        }),
        {
            name: 'settings', // unique name for the storage item
            storage: createJSONStorage(() => sessionStorage), // or localStorage
        }
    )
);



export default useSettingsStore;