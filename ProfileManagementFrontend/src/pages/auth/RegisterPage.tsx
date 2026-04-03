import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { registerUser } from '../../api/authApi'
import { useState } from 'react'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null)
      const response = await registerUser(data)
      setUser(response)
      navigate('/dashboard')
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Something went wrong')
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
        }
        .auth-btn:hover { background: #2D2926; }
        .auth-btn:active { transform: scale(0.99); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.15s; opacity: 0; }
        .stagger-3 { animation-delay: 0.2s; opacity: 0; }
        .stagger-4 { animation-delay: 0.25s; opacity: 0; }
        .stagger-5 { animation-delay: 0.3s; opacity: 0; }
        .stagger-6 { animation-delay: 0.35s; opacity: 0; }
      `}</style>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1A1814 0%, #2D2418 60%, #3D2E1E 100%)' }}>

        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #C4A882 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #E8D5B7 0%, transparent 40%)`,
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: '#C4A882', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: '#C4A882', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(196,168,130,0.15)', border: '1px solid rgba(196,168,130,0.3)' }}>
              <span style={{ color: '#C4A882', fontSize: 14, fontWeight: 600 }}>P</span>
            </div>
            <span style={{ color: '#E8D5B7', fontSize: 14, fontWeight: 500 }}>ProfileManager</span>
          </button>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <p style={{ color: '#C4A882', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              Start your journey
            </p>
            <h2 className="display" style={{ color: '#FAF9F7', fontSize: 52, lineHeight: 1.1, fontWeight: 400 }}>
              Build your<br />
              <em style={{ color: '#C4A882' }}>story</em> today
            </h2>
          </div>
          <p style={{ color: '#A89880', fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
            Join professionals who trust ProfileManager to showcase their work, skills, and experience to the world.
          </p>

          {/* Steps */}
          <div className="space-y-3 pt-2">
            {['Create your profile in minutes', 'Showcase skills & experience', 'Share your portfolio anywhere'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(196,168,130,0.2)', border: '1px solid rgba(196,168,130,0.3)' }}>
                  <span style={{ color: '#C4A882', fontSize: 10, fontWeight: 600 }}>{i + 1}</span>
                </div>
                <p style={{ color: '#A89880', fontSize: 13 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p style={{ color: '#6B6058', fontSize: 12 }}>© 2025 ProfileManager</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <div className="lg:hidden mb-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1A1814' }}>
              <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>P</span>
            </div>
            <span style={{ color: '#1A1814', fontSize: 14, fontWeight: 500 }}>ProfileManager</span>
          </div>

          <div className="fade-in stagger-1 mb-8">
            <h1 className="display" style={{ fontSize: 36, color: '#1A1814', fontWeight: 400, lineHeight: 1.2, marginBottom: 8 }}>
              Create account
            </h1>
            <p style={{ color: '#8C8278', fontSize: 14 }}>
              Start building your professional portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="fade-in stagger-2 grid grid-cols-2 gap-3">
              <div>
                <label style={{ fontSize: 12, color: '#6B6058', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  First name
                </label>
                <input className="auth-input" placeholder="John" {...register('firstName')} />
                {errors.firstName && (
                  <p style={{ fontSize: 11, color: '#C4735A', marginTop: 3 }}>{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#6B6058', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  Last name
                </label>
                <input className="auth-input" placeholder="Doe" {...register('lastName')} />
                {errors.lastName && (
                  <p style={{ fontSize: 11, color: '#C4735A', marginTop: 3 }}>{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="fade-in stagger-3">
              <label style={{ fontSize: 12, color: '#6B6058', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Email address
              </label>
              <input className="auth-input" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && (
                <p style={{ fontSize: 12, color: '#C4735A', marginTop: 4 }}>{errors.email.message}</p>
              )}
            </div>

            <div className="fade-in stagger-4">
              <label style={{ fontSize: 12, color: '#6B6058', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input className="auth-input" type="password" placeholder="Min. 6 characters" {...register('password')} />
              {errors.password && (
                <p style={{ fontSize: 12, color: '#C4735A', marginTop: 4 }}>{errors.password.message}</p>
              )}
            </div>

            <div className="fade-in stagger-5">
              <label style={{ fontSize: 12, color: '#6B6058', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                Confirm password
              </label>
              <input className="auth-input" type="password" placeholder="••••••••" {...register('confirmPassword')} />
              {errors.confirmPassword && (
                <p style={{ fontSize: 12, color: '#C4735A', marginTop: 4 }}>{errors.confirmPassword.message}</p>
              )}
            </div>

            {serverError && (
              <div style={{ background: '#FEF2EE', border: '1px solid #F5C4B5', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#C4735A' }}>{serverError}</p>
              </div>
            )}

            <div className="fade-in stagger-6 pt-2">
              <button type="submit" className="auth-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <p style={{ fontSize: 13, color: '#8C8278', marginTop: 24, textAlign: 'center' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{ color: '#C4A882', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign in
            </button>
          </p>

          <p style={{ fontSize: 13, color: '#8C8278', marginTop: 12, textAlign: 'center' }}>
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