import type { JobPostingCardData } from "@repo/schema";

export type JobPosting = Omit<JobPostingCardData, "departmentName" | "skills"> & {
    id: string;
    title: string;
    description: string;
    location: string | null;
    type: "FULL_TIME" | "INTERNSHIP" | "CONTRACT" | "PART_TIME" | "TEMPORARY";
    applyBy: string | null;
    startDate: string | null;
    department: {
        name: string;
    };
    jobSkills: Array<{
        skill: {
            id: string;
            name: string;
        };
        isRequired: boolean;
        importance: number;
        minimumYearsExperience: number;
    }>;
};
