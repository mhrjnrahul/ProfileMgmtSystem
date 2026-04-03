import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { loginUser } from '../../api/authApi'

import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null)
      const response = await loginUser(data)
      setUser(response)
      navigate('/dashboard')
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: '#FAF9F7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .display { font-family: 'Cormorant Garamond', serif; }
        .auth-input {
          background: white;
          border: 1.5px solid #EDE8E3;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          color: #1A1814;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
          width: 100%;
        }
        .auth-input:focus {
          border-color: #C4A882;
          box-shadow: 0 0 0 3px rgba(196,168,130,0.12);
        }
        .auth-input::placeholder { color: #B8B0A8; }
        .auth-btn {
          background: #1A1814;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 13px 24px;
          font-size: 14px;
          font-weight: 500;
          width: 100%;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          letter-spacing: 0.01em;
        }
        .auth-btn:hover { background: #2D2926; }
        .auth-btn:active { transform: scale(0.99); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1A1814 0%, #2D2418 60%, #3D2E1E 100%)' }}>

        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #C4A882 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #E8D5B7 0%, transparent 40%)`,
        }} />

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: '#C4A882', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: '#C4A882', transform: 'translate(-30%, 30%)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(196,168,130,0.15)', border: '1px solid rgba(196,168,130,0.3)' }}>
              <span style={{ color: '#C4A882', fontSize: 14, fontWeight: 600 }}>P</span>
            </div>
            <span style={{ color: '#E8D5B7', fontSize: 14, fontWeight: 500 }}>ProfileManager</span>
          </button>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div>
            <p style={{ color: '#C4A882', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              Your professional story
            </p>
            <h2 className="display" style={{ color: '#FAF9F7', fontSize: 52, lineHeight: 1.1, fontWeight: 400 }}>
              Where talent<br />
              <em style={{ color: '#C4A882' }}>meets</em> opportunity
            </h2>
          </div>
          <p style={{ color: '#A89880', fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
            Build a portfolio that speaks before you do. Showcase your journey, skills, and work to the people who matter.
          </p>

          {/* Testimonial */}
          <div className="pt-4" style={{ borderTop: '1px solid rgba(196,168,130,0.15)' }}>
            <p style={{ color: '#C4A882', fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>
              "A portfolio is your handshake before the meeting."
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p style={{ color: '#6B6058', fontSize: 12 }}>© 2025 ProfileManager</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#1A1814' }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>P</span>
            </div>
            <span style={{ color: '#1A1814', fontSize: 14, fontWeight: 500 }}>ProfileManager</span>
          </div>

          <div className="fade-in stagger-1 mb-8">
            <h1 className="display" style={{ fontSize: 36, color: '#1A1814', fontWeight: 400, lineHeight: 1.2, marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ color: '#8C8278', fontSize: 14 }}>
              Sign in to continue to your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="fade-in stagger-2">
              <label style={{ fontSize: 12, color: '#6B6058', fontWeight: 500, display: 'block', marginBottom: 6, letterSpacing: '0.02em' }}>
                Email address
              </label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p style={{ fontSize: 12, color: '#C4735A', marginTop: 4 }}>{errors.email.message}</p>
              )}
            </div>

            <div className="fade-in stagger-3">
              <label style={{ fontSize: 12, color: '#6B6058', fontWeight: 500, display: 'block', marginBottom: 6, letterSpacing: '0.02em' }}>
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p style={{ fontSize: 12, color: '#C4735A', marginTop: 4 }}>{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div style={{ background: '#FEF2EE', border: '1px solid #F5C4B5', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#C4735A' }}>{serverError}</p>
              </div>
            )}

            <div className="fade-in stagger-4 pt-2">
              <button type="submit" className="auth-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <p className="fade-in stagger-4" style={{ fontSize: 13, color: '#8C8278', marginTop: 24, textAlign: 'center' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{ color: '#C4A882', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Create one
            </button>
          </p>

          <p className="fade-in stagger-4" style={{ fontSize: 13, color: '#8C8278', marginTop: 12, textAlign: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ color: '#B8B0A8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}
            >
              ← Back to home
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}