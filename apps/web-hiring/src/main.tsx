import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { useSession } from '@repo/auth'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Auth/Login.tsx'
import SignUp from './pages/Auth/SignUp.tsx'
import Dashboard from './pages/Dashboard.tsx'
import { ProtectedLayout } from './components/layout/ProtectedLayout.tsx'
import { GuestLayout } from './components/layout/GuestLayout.tsx'
import OnboardingOrganization from './pages/Onboarding/OnboardingOrganization.tsx'
import CreateOrganization from './pages/Onboarding/CreateOrganization.tsx'
import JoinOrganization from './pages/Onboarding/JoinOrganization.tsx'
import { NoOrganizationRequiredLayout } from './components/layout/NoOrganizationRequiredLayout.tsx'
import { useOrganizationStore } from './store/useOrganizationStore.ts'
import InviteMember from './pages/InviteUser.tsx'
import { useAdminStore } from './store/useAdminStore.ts'
import { AdminLayout } from './components/layout/AdminLayout.tsx'
import Organization from './pages/Organization.tsx'
import UpdateOrganization from './pages/UpdateOrganization.tsx'

function OrganizationStatusBootstrap() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session) {
      useOrganizationStore.getState().setOrganization(null);
      return;
    }

    void useOrganizationStore.getState().checkOrganizationStatus();
  }, [isPending, session?.user.id]);

  return null;
}

function AdminStatusBootstrap() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session) {
      useAdminStore.getState().setAdmin(null);
      return;
    }

    void useAdminStore.getState().checkAdminStatus();
  }, [isPending, session?.user.id]);

  return null;
}

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <App/>
  },

  // Guest only routes
  {
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <SignUp/>
      }
    ]
  },

  // Protected Routes Group
  {
    element: <ProtectedLayout/>,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        element: <NoOrganizationRequiredLayout/>,
        children: [
          {
            path: '/onboarding/organization',
            element: <OnboardingOrganization/>
          },
          {
            path: '/onboarding/organization/create',
            element: <CreateOrganization/>
          },
        ]
      },
      {
        element: <AdminLayout/>,
        children: [
          {
            path: '/invite-members',
            element: <InviteMember/>
          },
          {
            path: '/organization/update',
            element: <UpdateOrganization/>
          }
        ]
      },
      {
        path: '/invite/:inviteToken',
        element: <JoinOrganization/>
      },
      {
        path: '/organization',
        element: <Organization/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <OrganizationStatusBootstrap />
      <AdminStatusBootstrap/>
      <RouterProvider router={router}/>
    </>
  </StrictMode>,
)