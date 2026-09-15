import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages.tsx/Auth/Login.tsx'
import SignUp from './pages.tsx/Auth/SignUp.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <SignUp/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
