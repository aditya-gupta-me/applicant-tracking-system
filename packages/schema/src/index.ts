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
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;