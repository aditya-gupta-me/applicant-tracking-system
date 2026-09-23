import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
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

function OrganizationStatusBootstrap() {
  useEffect(() => {
    void useOrganizationStore.getState().checkOrganizationStatus();
  }, []);

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
          {
            path: '/onboarding/organization/join',
            element: <JoinOrganization/>
          }
        ]
      },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <OrganizationStatusBootstrap />
      <RouterProvider router={router}/>
    </>
  </StrictMode>,
)
