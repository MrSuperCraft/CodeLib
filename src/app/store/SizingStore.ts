import { create } from 'zustand';

interface SizingStore {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
}



const useSizingStore = create<SizingStore>((set) => ({
    isCollapsed: false,
    toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed }))
}));

export default useSizingStore;