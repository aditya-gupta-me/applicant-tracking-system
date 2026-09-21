import { z } from "zod";


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

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type OrganizationInput = z.infer<typeof createOrganizationSchema>;