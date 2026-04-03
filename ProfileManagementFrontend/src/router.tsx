import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import DashboardLayout from './components/layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import AdminRoute from './components/layouts/AdminRoute'
import AdminPage from './pages/admin/AdminPage'
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage'
import EditPortfolioPage from './pages/portfolio/EditPortfolioPage'
import MyPortfolioPage from './pages/portfolio/MyPortfolioPage'
// import Myp
import HomePage from './pages/home/HomePage'
import PublicPortfolioPage
 from './pages/portfolio/PublicPorfolioPage'
const router = createBrowserRouter([
  // Public routes — no auth needed
  { path: '/', element: <HomePage /> },
  { path: '/portfolio/:userId', element: <PublicPortfolioPage /> },

  // Auth routes — redirect to dashboard if already logged in
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // Protected routes — redirect to login if not authenticated
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/portfolio/edit', element: <EditPortfolioPage /> },
          { path: '/portfolio/preview', element: <MyPortfolioPage /> },
          { path: '/profile/settings', element: <ProfileSettingsPage /> },

          // Admin only
          {
            element: <AdminRoute />,
            children: [
              { path: '/admin', element: <AdminPage /> },
            ],
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}