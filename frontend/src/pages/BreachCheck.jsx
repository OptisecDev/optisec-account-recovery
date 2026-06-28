import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

const SECURITY_TIPS = [
  { icon: '🔑', tip: 'استخدم كلمات مرور فريدة لكل حساب ولا تكررها أبداً' },
  { icon: '🔐', tip: 'فعّل المصادقة الثنائية (2FA) على جميع حساباتك المهمة' },
  { icon: '📧', tip: 'لا تستخدم نفس الإيميل لجميع المواقع والخدمات' },
  { icon: '🛡️', tip: 'استخدم مدير كلمات مرور موثوق مثل Bitwarden أو 1Password' },
  { icon: '🔄', tip: 'غيّر كلمة المرور فوراً إذا علمت بأن بياناتك قد سُرّبت' },
  { icon: '👁️', tip: 'راقب حساباتك المصرفية بشكل دوري للكشف عن أي نشاط مشبوه' },
]

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toString()
}

export default function BreachCheck() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [checked, setChecked] = useState(false)

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setChecked(false)
    try {
      const res = await axios.get(`${API_URL}/api/check-breach`, { params: { email: email.trim() } })
      setResult(res.data)
      setChecked(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ في الفحص، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <Link to="/" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '2px', textDecoration: 'none' }}>
          <span style={{ color: 'var(--cyan)' }}>OPTISEC</span>
          <span style={{ color: 'var(--white)', marginRight: '6px', marginLeft: '6px' }}>RECOVERY</span>
        </Link>
        <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseOver={e => e.target.style.color = 'var(--cyan)'}
          onMouseOut={e => e.target.style.color = 'var(--muted)'}>
          ← الصفحة الرئيسية
        </Link>
      </nav>

      {/* Hero */}
      <div style={{
        padding: '4rem 2rem 3rem', textAlign: 'center',
        background: 'linear-gradient(180deg, var(--deep) 0%, var(--black) 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', marginBottom: '1rem',
            background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)',
            borderRadius: '20px', padding: '5px 16px',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem', color: 'var(--cyan)', letterSpacing: '1px'
          }}>DATA BREACH CHECKER v1.0</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--white)', marginBottom: '0.8rem' }}>
            فحص <span style={{ color: 'var(--cyan)' }}>تسريب البيانات</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            تحقق إذا كان إيميلك أو حسابك موجود في تسريبات بيانات عالمية
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Search Form */}
        <form onSubmit={handleCheck} style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني للفحص..."
            required
            style={{
              flex: 1, minWidth: '220px', background: 'var(--panel)',
              border: '1px solid var(--border)', color: 'var(--white)',
              padding: '14px 18px', borderRadius: '10px', fontSize: '1rem', outline: 'none'
            }}
          />
          <button type="submit" disabled={loading}
            style={{
              background: loading ? 'var(--border)' : 'var(--cyan)', color: '#000',
              border: 'none', padding: '14px 28px', borderRadius: '10px',
              fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap',
              boxShadow: loading ? 'none' : '0 0 20px rgba(0,229,255,0.35)', transition: 'all 0.2s'
            }}>
            {loading ? '⏳ جارٍ الفحص...' : '🔍 فحص الآن'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255,23,68,0.1)', border: '1px solid var(--red)',
            borderRadius: '12px', padding: '1.2rem 1.5rem', color: 'var(--red)',
            marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {checked && result && (
          <div style={{ marginBottom: '2.5rem' }}>
            {!result.breached ? (
              <div style={{
                background: 'rgba(0,230,118,0.07)', border: '2px solid var(--green)',
                borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center',
                boxShadow: '0 0 40px rgba(0,230,118,0.08)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ color: 'var(--green)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.6rem' }}>
                  إيميلك آمن!
                </h2>
                <p style={{ color: 'var(--text)', fontSize: '1rem', marginBottom: '1.5rem' }}>
                  لم يُكشف في أي تسريب بيانات عالمي معروف
                </p>
                <div style={{
                  padding: '0.7rem 1.5rem', background: 'rgba(0,230,118,0.1)',
                  borderRadius: '8px', display: 'inline-block',
                  color: 'var(--green)', fontSize: '0.9rem', fontFamily: "'Share Tech Mono', monospace"
                }}>
                  {email}
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'rgba(255,23,68,0.07)', border: '2px solid var(--red)',
                  borderRadius: '16px', padding: '2rem', textAlign: 'center',
                  marginBottom: '1.5rem', boxShadow: '0 0 40px rgba(255,23,68,0.08)'
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '0.8rem' }}>🚨</div>
                  <h2 style={{ color: 'var(--red)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                    تم اكتشاف {result.count} تسريب!
                  </h2>
                  <p style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                    إيميلك موجود في تسريبات بيانات عالمية — غيّر كلمة مرورك فوراً
                  </p>
                  <div style={{
                    padding: '0.6rem 1.2rem', background: 'rgba(255,23,68,0.1)',
                    borderRadius: '8px', display: 'inline-block',
                    color: 'var(--red)', fontSize: '0.85rem', fontFamily: "'Share Tech Mono', monospace"
                  }}>
                    {email}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {result.breaches.map((breach, i) => (
                    <div key={i} style={{
                      background: 'var(--panel)', border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '1.2rem 1.5rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      flexWrap: 'wrap', gap: '0.8rem', transition: 'border-color 0.2s'
                    }}
                      onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,23,68,0.4)'}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <div>
                        <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>
                          🔴 {breach.title || breach.name}
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.82rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          {breach.domain && <span>🌐 {breach.domain}</span>}
                          {breach.date && <span>📅 {breach.date}</span>}
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.25)',
                        borderRadius: '8px', padding: '0.4rem 0.9rem',
                        color: 'var(--red)', fontSize: '0.82rem', fontFamily: "'Share Tech Mono', monospace",
                        whiteSpace: 'nowrap'
                      }}>
                        {formatNumber(breach.count)} حساب مخترق
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: '1rem 1.5rem',
                  background: 'rgba(255,214,0,0.06)', border: '1px solid rgba(255,214,0,0.3)',
                  borderRadius: '10px', color: 'var(--yellow)', fontSize: '0.9rem', textAlign: 'center'
                }}>
                  ⚠️ يُنصح بتغيير كلمة مرورك فوراً وتفعيل المصادقة الثنائية على جميع حساباتك
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Tips */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ color: 'var(--white)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            نصائح لحماية حسابك
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {SECURITY_TIPS.map((item, i) => (
              <div key={i} style={{
                background: 'var(--panel)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '1.2rem 1.5rem',
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                transition: 'border-color 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }}>{item.icon}</span>
                <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: 'var(--cyan)', fontWeight: 600 }}>← العودة للصفحة الرئيسية</Link>
        </div>
      </div>
    </div>
  )
}
