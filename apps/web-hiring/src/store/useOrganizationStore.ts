import { api } from "@/api/api";
import { create } from "zustand";

type OrganizationState = {
    organization: boolean | null;
    isLoading: boolean;
    setOrganization: (organizationData: boolean | null) => void;
    checkOrganizationStatus: () => Promise<void>;
};

export const useOrganizationStore = create<OrganizationState>((set) => ({
    organization: null,
    isLoading: true,

    setOrganization: (organizationData) => set({organization: organizationData, isLoading: false}),


    checkOrganizationStatus: async () => {
        try {
            const response = await api.get('api/organization/user-exists');

            console.log("State, org: ", response.data);

            set({ organization: response.data.exists || null, isLoading: false });
        } catch (error) {
            set({ organization: null, isLoading: false });
        }
    }
}))