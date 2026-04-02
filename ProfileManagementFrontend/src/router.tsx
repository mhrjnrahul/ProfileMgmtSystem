import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import DashboardLayout from './components/layouts/DashboardLayout'
import EducationPage from './pages/education/EducationPage'
import WorkExperiencePage from './pages/workexperience/WorkExperiencePage'
import SkillPage from './pages/skill/SkillPage'
import ProjectPage from './pages/project/ProjectPage'
import SocialLinkPage from './pages/socialLink/SocialLinkPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AdminRoute from './components/layouts/AdminRoute'
import AdminPage from './pages/admin/AdminPage'
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage'
import EditPortfolioPage from './pages/portfolio/EditPortfolioPage'
import HomePage from './pages/home/HomePage'
import PublicPortfolioPage from './pages/portfolio/PublicPorfolioPage'

const router = createBrowserRouter([
  {path: '/', element: <HomePage />},
  { path: '/portfolio/:userId', element: <PublicPortfolioPage /> },
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/education', element: <EducationPage /> },
          { path: '/workexperience', element: <WorkExperiencePage /> },
          { path: '/skill', element: <SkillPage /> },
          { path: '/project', element: <ProjectPage /> },
          { path: '/sociallink', element: <SocialLinkPage /> },
          { path: '/profile/settings', element: <ProfileSettingsPage /> },
          { path: '/portfolio/edit', element: <EditPortfolioPage /> },

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