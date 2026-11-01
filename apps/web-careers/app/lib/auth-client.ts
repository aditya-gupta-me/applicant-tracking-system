import { createAppAuthClient } from '@repo/auth';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
}

export const authClient = createAppAuthClient(baseURL);

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;
