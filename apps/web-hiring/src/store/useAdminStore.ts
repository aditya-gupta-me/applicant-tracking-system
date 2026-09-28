import { api } from "@/api/api";
import { create } from "zustand";

type AdminState = {
    admin: boolean | null;
    isLoading: boolean;
    setAdmin: (adminData: boolean | null) => void;
    checkAdminStatus: () => Promise<void>;
};

export const useAdminStore = create<AdminState>((set) => ({
    admin: null,
    isLoading: true,

    setAdmin: (adminData) => set({admin: adminData, isLoading: false}),


    checkAdminStatus: async () => {
        try {
            const response = await api.get('api/organization/admin/is-admin');

            set({ admin: response.data.exists || null, isLoading: false });
        } catch (error) {
            set({ admin: null, isLoading: false });
        }
    }
}))