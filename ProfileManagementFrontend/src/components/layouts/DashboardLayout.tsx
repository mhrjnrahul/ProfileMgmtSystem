import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

const userNavItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Edit Portfolio', path: '/portfolio/edit' },
  { label: 'My Portfolio', path: '/portfolio/preview' },
  { label: 'Profile Settings', path: '/profile/settings' },
]

const adminNavItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'User Management', path: '/admin' },
  { label: 'My Portfolio', path: '/portfolio/preview' },
  { label: 'Edit Portfolio', path: '/portfolio/edit' },
  { label: 'Profile Settings', path: '/profile/settings' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuthStore((state) => state)
  const navigate = useNavigate()
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()
  const allNavItems = user?.role === 'Admin' ? adminNavItems : userNavItems

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0EDE8' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: '#1A1814',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#E8D5B7', fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>P</div>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: '#1A1814', fontWeight: 400, whiteSpace: 'nowrap' }}>
            ProfileManager
          </span>
        </button>

        <button
          onClick={() => setMobileOpen(false)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: '1px solid #F0EDE8', borderRadius: 8,
            width: 30, height: 30, cursor: 'pointer', color: '#8C8278',
            fontSize: 14, transition: 'all 0.15s ease',
          }}
          className="mobile-close-btn"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        <p style={{ fontSize: 10, color: '#C4B8AC', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px 8px', fontWeight: 500 }}>
          Menu
        </p>
        {allNavItems.map((item) => {
          const isActive = location.pathname === item.path
          const isUserManagement = item.label === 'User Management'
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '9px 12px',
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#FAF9F7' : isUserManagement ? '#C4A882' : '#8C8278',
                background: isActive ? '#1A1814' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.15s ease, color 0.15s ease',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = isUserManagement ? '#FBF6EF' : '#F5F0EA'
                  ;(e.currentTarget as HTMLElement).style.color = isUserManagement ? '#A8895E' : '#1A1814'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = isUserManagement ? '#C4A882' : '#8C8278'
                }
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: '#F0EDE8', margin: '0 12px' }} />

      {/* User section */}
      <div style={{ padding: '14px 12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1A1814, #3D2E1E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#E8D5B7', fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#1A1814', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ fontSize: 11, color: '#B8B0A8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', textAlign: 'left', fontSize: 13, color: '#C4735A',
            background: 'none', border: 'none', padding: '9px 12px', borderRadius: 10,
            cursor: 'pointer', transition: 'background 0.15s ease',
            fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FEF2EE')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#FAF9F7', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .desktop-sidebar {
          width: 232px;
          background: white;
          border-right: 1px solid #F0EDE8;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }

        .mobile-sidebar {
          display: none;
          position: fixed;
          top: 0; left: 0;
          height: 100vh;
          width: 232px;
          background: white;
          border-right: 1px solid #F0EDE8;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 24px rgba(26,24,20,0.10);
        }

        .mobile-sidebar.open {
          transform: translateX(0);
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(26,24,20,0.25);
          z-index: 40;
        }

        .mobile-topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 52px;
          background: white;
          border-bottom: 1px solid #F0EDE8;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 30;
        }

        @media (max-width: 767px) {
          .desktop-sidebar { display: none; }
          .mobile-sidebar { display: flex; flex-direction: column; }
          .mobile-overlay.visible { display: block; }
          .mobile-topbar { display: flex; }
          .main-content { padding-top: 52px; }
        }

        @media (min-width: 768px) {
          .mobile-close-btn { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${mobileOpen ? 'open' : ''}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7, background: '#1A1814',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#E8D5B7', fontSize: 12, fontWeight: 700,
          }}>P</div>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 16, color: '#1A1814' }}>
            ProfileManager
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'none', border: '1px solid #F0EDE8', borderRadius: 8,
            width: 36, height: 36, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', fontSize: 16,
            color: '#6B6058', transition: 'all 0.15s ease',
          }}
        >
          ☰
        </button>
      </div>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}