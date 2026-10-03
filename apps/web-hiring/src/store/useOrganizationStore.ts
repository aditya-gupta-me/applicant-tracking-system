import { api } from "@/api/api";
import { create } from "zustand";

export type OrganizationDetails = {
    name: string;
    image: string | null;
    email: string | null;
    website: string | null;
    foundedOn: string | null;
};

type OrganizationState = {
    organization: boolean | null;
    details: OrganizationDetails | null;
    isLoading: boolean;
    setOrganization: (organizationData: boolean | null) => void;
    setOrganizationDetails: (details: OrganizationDetails | null) => void;
    fetchOrganizationDetails: () => Promise<void>;
    checkOrganizationStatus: () => Promise<void>;
};

export const useOrganizationStore = create<OrganizationState>((set) => ({
    organization: null,
    details: null,
    isLoading: true,

    setOrganization: (organizationData) => set((state) => ({
        organization: organizationData,
        details: organizationData ? state.details : null,
        isLoading: false,
    })),
    setOrganizationDetails: (details) => set({ details }),

    fetchOrganizationDetails: async () => {
        const response = await api.get("api/organization/details");
        const organization = response.data.org;

        set({
            details: {
                name: organization?.name ?? "",
                image: organization?.image ?? null,
                email: organization?.email ?? null,
                website: organization?.website ?? null,
                foundedOn: organization?.foundedOn ?? null,
            },
        });
    },

    checkOrganizationStatus: async () => {
        try {
            const response = await api.get('api/organization/user-exists-in-org');

            set({ organization: response.data.exists || null, isLoading: false });
        } catch (error) {
            set({ organization: null, isLoading: false });
        }
    }
}))