import { create } from "zustand";
import { api } from "@/api/api";

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Invited";
}

type TeamMembersState = {
    teamMembers: TeamMember[];
    isLoading: boolean;
    setTeamMembers: (teamMembersData: TeamMember[]) => void;
    getTeamMembers: () => Promise<void>;
};

export const useTeamMembersStore = create<TeamMembersState>((set) => ({
    teamMembers: [],
    isLoading: true,

    setTeamMembers: (teamMembersData) => set({ teamMembers: teamMembersData, isLoading: false }),

    getTeamMembers: async () => {
        try {
            const response = await api.get('api/organization/team-members');

            set({ teamMembers: response.data.users || [], isLoading: false });
        } catch (error) {
            set({ teamMembers: [], isLoading: false })
        }
    }
}))
