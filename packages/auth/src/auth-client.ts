import { createAuthClient } from "better-auth/react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const authClient = createAuthClient({
    baseURL: baseURL
});

export const { useSession, signIn, signUp, signOut } = authClient;