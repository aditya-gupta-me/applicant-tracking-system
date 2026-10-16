import { create } from "zustand";

import { api } from "@/api/api";

export type Department = {
    id: string;
    name: string;
    organizationId: string;
};

type DepartmentState = {
    departments: Department[];
    isLoading: boolean;
    error: string | null;
    setDepartments: (departments: Department[]) => void;
    getDepartments: () => Promise<void>;
};

export const useDepartmentStore = create<DepartmentState>((set) => ({
    departments: [],
    isLoading: false,
    error: null,

    setDepartments: (departments) => set({
        departments,
        isLoading: false,
        error: null,
    }),

    getDepartments: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get<{ departments: Department[] }>("api/department/getAll");
            set({
                departments: response.data.departments,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error("Unable to load departments:", error);
            set({
                departments: [],
                isLoading: false,
                error: "We couldn't load departments. Please try again.",
            });
        }
    },
}));
