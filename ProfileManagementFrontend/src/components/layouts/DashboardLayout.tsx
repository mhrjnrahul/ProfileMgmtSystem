import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function DashboardLayout() {
  const { user, logout } = useAuthStore((state) => state)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Edit Portfolio', path: '/portfolio/edit' },
      { label: 'My Portfolio', path: '/portfolio/preview' },
    { label: 'Profile Settings', path: '/profile/settings' },
    ...(user?.role === 'Admin' ? [{ label: 'Admin', path: '/admin' }] : []),
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAF9F7', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .display { font-family: 'Cormorant Garamond', serif; }
        .nav-link {
          display: flex;
          align-items: center;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 400;
          color: #8C8278;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
          letter-spacing: 0.01em;
        }
        .nav-link:hover {
          background: #F5F0EA;
          color: #1A1814;
        }
        .nav-link.active {
          background: #1A1814;
          color: #FAF9F7;
          font-weight: 500;
        }
        .nav-link.admin-link {
          color: #C4A882;
        }
        .nav-link.admin-link:hover {
          background: #FBF6EF;
          color: #A8895E;
        }
        .nav-link.admin-link.active {
          background: #1A1814;
          color: #C4A882;
        }
        .logout-btn {
          width: 100%;
          text-align: left;
          font-size: 13px;
          color: #C4735A;
          background: none;
          border: none;
          padding: 9px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .logout-btn:hover {
          background: #FEF2EE;
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 232,
        background: 'white',
        borderRight: '1px solid #F0EDE8',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{ padding: '24px 20px 20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: '#1A1814',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#E8D5B7', fontSize: 12, fontWeight: 600 }}>P</span>
            </div>
            <span className="display" style={{ fontSize: 18, color: '#1A1814', fontWeight: 400 }}>
              ProfileManager
            </span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#F0EDE8', margin: '0 20px' }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>

          <p style={{ fontSize: 10, color: '#C4B8AC', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px 8px', fontWeight: 500 }}>
            Menu
          </p>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const isAdmin = item.label === 'Admin'
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''} ${isAdmin && !isActive ? 'admin-link' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: '#F0EDE8', margin: '0 20px' }} />

        {/* User Section */}
        <div style={{ padding: '16px 12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A1814, #3D2E1E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#E8D5B7', fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1814', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ fontSize: 11, color: '#B8B0A8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}