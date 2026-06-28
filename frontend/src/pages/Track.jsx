import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

const TIMELINE = [
  { key: 'pending', label: 'تم الاستلام', icon: '📥' },
  { key: 'reviewing', label: 'قيد المراجعة', icon: '🔍' },
  { key: 'in_progress', label: 'قيد التنفيذ', icon: '⚙️' },
  { key: 'resolved', label: 'تم الحل', icon: '✅' },
]

const STATUS_STEP = { pending: 0, reviewing: 1, in_progress: 2, resolved: 3 }

const PLATFORM_EMOJI = {
  Facebook: '📘', Instagram: '📸', TikTok: '🎵', YouTube: '▶️',
  'X (Twitter)': '🐦', LinkedIn: '💼', Snapchat: '👻',
}

export default function Track() {
  const [email, setEmail] = useState('')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setSearched(false)
    try {
      const res = await axios.get(`${API_URL}/api/requests/track/${encodeURIComponent(email.trim())}`)
      setRequests(res.data.data || [])
      setSearched(true)
    } catch {
      setError('حدث خطأ في البحث، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const getStep = (status) => STATUS_STEP[status] ?? 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', direction: 'rtl' }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px'
      }}>
        <Link to="/" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '2px', textDecoration: 'none' }}>
          <span style={{ color: 'var(--cyan)' }}>OPTISEC</span>
          <span style={{ color: 'var(--white)', marginRight: '6px', marginLeft: '6px' }}>RECOVERY</span>
        </Link>
        <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.9rem', textDecoration: 'none' }}>← الصفحة الرئيسية</Link>
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
          }}>REQUEST TRACKER v1.0</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--white)', marginBottom: '0.8rem' }}>
            تتبع <span style={{ color: 'var(--cyan)' }}>طلبك</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            أدخل بريدك الإلكتروني لمتابعة حالة طلبات الاسترجاع الخاصة بك
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني..."
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
              boxShadow: loading ? 'none' : '0 0 20px rgba(0,229,255,0.35)'
            }}>
            {loading ? '⏳ بحث...' : '🔍 بحث'}
          </button>
        </form>

        {error && (
          <div style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid var(--red)', borderRadius: '10px', padding: '1rem', textAlign: 'center', color: 'var(--red)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {searched && requests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>لا توجد طلبات مسجلة لهذا البريد الإلكتروني</p>
          </div>
        )}

        {/* Request Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {requests.map((req) => {
            const step = getStep(req.status)
            return (
              <div key={req.id} style={{
                background: 'var(--panel)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1.8rem', overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{PLATFORM_EMOJI[req.platform] || '📱'}</span>
                    <div>
                      <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1rem' }}>{req.platform}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{req.service}</div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: "'Share Tech Mono', monospace" }}>
                    {new Date(req.created_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                  {/* Progress line */}
                  <div style={{
                    position: 'absolute', top: '20px', right: '20px', left: '20px', height: '2px',
                    background: 'var(--border)', zIndex: 0
                  }} />
                  <div style={{
                    position: 'absolute', top: '20px', right: '20px', height: '2px', zIndex: 1,
                    background: 'linear-gradient(to left, var(--cyan), var(--cyan2))',
                    width: step === 0 ? '0%' : step === 1 ? '33%' : step === 2 ? '66%' : '100%',
                    transition: 'width 0.5s ease'
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    {TIMELINE.map((tl, i) => {
                      const isActive = i <= step
                      const isCurrent = i === step
                      return (
                        <div key={tl.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: isActive ? 'linear-gradient(135deg, var(--cyan), var(--cyan2))' : 'var(--deep)',
                            border: isCurrent ? '2px solid var(--cyan)' : isActive ? '2px solid var(--cyan2)' : '2px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', transition: 'all 0.3s',
                            boxShadow: isCurrent ? '0 0 15px rgba(0,229,255,0.5)' : 'none'
                          }}>
                            {tl.icon}
                          </div>
                          <div style={{
                            fontSize: '0.72rem', textAlign: 'center', color: isActive ? 'var(--cyan)' : 'var(--muted)',
                            fontWeight: isCurrent ? 700 : 400, maxWidth: '70px', lineHeight: 1.3
                          }}>
                            {tl.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Problem type */}
                {req.problem_type && (
                  <div style={{ marginTop: '1.2rem', padding: '0.7rem 1rem', background: 'var(--deep)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--muted)' }}>
                    المشكلة: <span style={{ color: 'var(--text)' }}>{req.problem_type}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          هل تريد إرسال طلب جديد؟{' '}
          <Link to="/" style={{ color: 'var(--cyan)', fontWeight: 600 }}>اضغط هنا</Link>
        </div>
      </div>
    </div>
  )
}
