import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import DashboardLayout from './components/layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import AdminRoute from './components/layouts/AdminRoute'
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage'
import EditPortfolioPage from './pages/portfolio/EditPortfolioPage'
import MyPortfolioPage from './pages/portfolio/MyPortfolioPage'
// import Myp
import HomePage from './pages/home/HomePage'
import PublicPortfolioPage
 from './pages/portfolio/PublicPorfolioPage'
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage'
import { useAuthStore } from './store/authStore'
import UserManagementPage from './pages/admin/UserManagementPage'

 function DashboardPageRouter() {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'Admin' ? <AdminDashboardPage /> : <DashboardPage />;
}
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
          { path: '/dashboard', element: <DashboardPageRouter /> },
          { path: '/portfolio/edit', element: <EditPortfolioPage /> },
          { path: '/portfolio/preview', element: <MyPortfolioPage /> },
          { path: '/profile/settings', element: <ProfileSettingsPage /> },

          // Admin only
          {
            element: <AdminRoute />,
            children: [
              { path: '/admin', element: <UserManagementPage /> },
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