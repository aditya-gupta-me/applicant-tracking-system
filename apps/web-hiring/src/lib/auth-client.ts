import { createAppAuthClient } from "@repo/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

export const authClient = createAppAuthClient(baseURL);

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;