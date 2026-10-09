import { z } from "zod";


enum UserRole {
    Recruiter = "RECRUITER",
    Hiring_Manager = "HIRING_MANAGER"
}

enum JobType {
    FullTime = "FULL_TIME",
    Internship = "INTERNSHIP",
    Contract = "CONTRACT",
    PartTime = "PART_TIME",
    Temporary = "TEMPORARY",
}

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().refine(
        (value) => value.trim().length > 0,
        "Password is required"
    )
});

export const signUpSchema = z.object({
    fullName: z.string().trim().min(1, "Name is required"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
})

export const createOrganizationSchema = z.object({
    name: z.string().trim().min(1, "Organization name is required"),
    website: z.url("Invalid URL layout"),
    email: z.email("Please enter a valid email address"),
    image: z.string().optional(),
    establishedDate: z.coerce.date()
    .refine((date) => date <= new Date(), {
        error: "Established date cannot be in the future"
    })
})

export const inviteUserInOrganizationSchema = z.object({
    email: z.email("Please enter a valid email address"),
    role: z.enum(UserRole)
})

export const updateOrganizationSchema = z.object({
    name: z.string().trim().min(1, "Organization name is required"),
    image: z.url().optional(),
    email: z.email("Please enter a valid email address"),
    website: z.url("Invalid URL layout"),
    establishedDate: z.coerce.date()
})

export const createDepartmentSchema = z.object({
    name: z.string().trim().min(1, "Department name is required")
})

export const getDepartmentsSchema = z.object({
    orgId: z.string().min(1, "Organization Id is required")
})

export const createJobPostingSchema = z.object({
    title: z.string().trim().min(1, 'Job title is required'),
    description: z.string().trim().min(1, "Job description is required"),
    applyBy: z.coerce.date()
    .refine((date) => date >= new Date(), {
        error: "Apply-by date cannot be set in the past"
    }),
    location: z.string().trim().min(1, "Job location is required"),
    startDate: z.coerce.date()
    .refine((date) => date >= new Date(), {
        error: "Job starting date cannot be set in the past."
    }),
    type: z.enum(JobType),
    departmentId: z.string().trim().min(1, "Department ID is required"),
    organizationId: z.string().trim().min(1, "Organization ID is required")
})

export const createSkillCategorySchema = z.object({
    categoryName: z.string().trim().min(1, "Skill category name is required"),
    description: z.string().trim().min(1, "Skill category description is missing").optional(),
    createdAt: z.coerce.date()
    .refine((date) => date >= new Date(), {
        error: "Date cannot be set in the past"
    })
})

export const createSkillsSchema = z.object({
    name: z.string().trim().min(1, "Skill name is required"),
    isActive: z.boolean(),
    createdAt: z.coerce.date()
    .refine((date) => date >= new Date(), {
        error: "Date cannot be set in the past"
    }),
    categoryId: z.string().trim().min(1, "Category ID is required")
})

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type OrganizationInput = z.infer<typeof createOrganizationSchema>;
export type InviteUserInput = z.infer<typeof inviteUserInOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type GetDepartmentInput = z.infer<typeof getDepartmentsSchema>;
export type CreateJobPostingInput = z.infer<typeof createJobPostingSchema>;
export type CreateSkillCategoryInput = z.infer<typeof createSkillCategorySchema>;
export type CreateSkillsInput = z.infer<typeof createSkillsSchema>;