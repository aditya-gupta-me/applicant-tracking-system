import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Auth/Login.tsx'
import SignUp from './pages/Auth/SignUp.tsx'
import Dashboard from './pages/Dashboard.tsx'
import { ProtectedRoute } from './components/auth/ProtectedLayout.tsx'
import { GuestLayout } from './components/auth/GuestLayout.tsx'


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
    element: <ProtectedRoute/>,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard/>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
