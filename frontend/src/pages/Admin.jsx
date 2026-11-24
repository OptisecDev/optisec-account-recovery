import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

const STATUS_LABELS = { pending: 'قيد الانتظار', in_progress: 'قيد التنفيذ', resolved: 'مكتمل' }
const STATUS_COLORS = { pending: 'var(--yellow)', in_progress: 'var(--cyan)', resolved: 'var(--green)' }
const STATUS_BG = { pending: 'rgba(255,214,0,0.1)', in_progress: 'rgba(0,229,255,0.1)', resolved: 'rgba(0,230,118,0.1)' }

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('optisec_admin_token') || '')
  const authed = Boolean(token)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [requests, setRequests] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0, revenue: 0 })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [reqRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/requests`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      setRequests(reqRes.data.data || [])
      setStats(statsRes.data)
    } catch (err) {
      // token expired or invalid: log out; otherwise silently handle
      if (err?.response?.status === 401) {
        sessionStorage.removeItem('optisec_admin_token')
        setToken('')
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, fetchData])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // the password is checked by the backend, never in the browser
      const res = await axios.post(`${API_URL}/api/admin/login`, { password })
      sessionStorage.setItem('optisec_admin_token', res.data.token)
      setPassword('')
      setToken(res.data.token)
    } catch {
      setLoginError('كلمة المرور غير صحيحة')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('optisec_admin_token')
    setToken('')
  }

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await axios.put(`${API_URL}/api/requests/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } })
      await fetchData()
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = requests.filter(r => {
    const matchSearch = !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || r.status === filterStatus
    const matchPlatform = !filterPlatform || r.platform === filterPlatform
    return matchSearch && matchStatus && matchPlatform
  })

  const platforms = [...new Set(requests.map(r => r.platform).filter(Boolean))]

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--black)',
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '2rem', letterSpacing: '3px', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--cyan)' }}>OPTISEC</span>
              <span style={{ color: 'var(--white)', marginRight: '8px', marginLeft: '8px' }}>RECOVERY</span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', fontFamily: "'Share Tech Mono', monospace" }}>ADMIN CONTROL PANEL</div>
          </div>

          <form onSubmit={handleLogin} style={{
            background: 'var(--panel)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem'
          }}>
            <h2 style={{ color: 'var(--white)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              تسجيل الدخول
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                style={{
                  width: '100%', background: 'var(--deep)', border: '1px solid var(--border)',
                  color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '1rem', outline: 'none'
                }}
              />
            </div>
            {loginError && <div style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{loginError}</div>}
            <button type="submit" style={{
              width: '100%', background: 'var(--cyan)', color: '#000',
              border: 'none', padding: '13px', borderRadius: '8px', fontWeight: 700,
              fontSize: '1rem', boxShadow: '0 0 20px rgba(0,229,255,0.3)'
            }}>دخول</button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'إجمالي الطلبات', value: stats.total, color: 'var(--cyan)', icon: '📋' },
    { label: 'قيد الانتظار', value: stats.pending, color: 'var(--yellow)', icon: '⏳' },
    { label: 'قيد التنفيذ', value: stats.in_progress, color: 'var(--cyan)', icon: '⚙️' },
    { label: 'مكتملة', value: stats.resolved, color: 'var(--green)', icon: '✅' },
    { label: 'الإيرادات', value: `$${stats.revenue}`, color: 'var(--green)', icon: '💰' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', direction: 'rtl' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '2px' }}>
          <span style={{ color: 'var(--cyan)' }}>OPTISEC</span>
          <span style={{ color: 'var(--white)', marginRight: '6px', marginLeft: '6px' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>الموقع</Link>
          <button onClick={handleLogout}
            style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid var(--red)', color: 'var(--red)', padding: '7px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
            تسجيل خروج
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{
              background: 'var(--panel)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.4rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ color: card.color, fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Share Tech Mono', monospace" }}>
                {loading ? '...' : card.value}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '0.3rem' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--panel)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem',
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 بحث بالاسم أو الإيميل..."
            style={{
              flex: '1', minWidth: '200px', background: 'var(--deep)', border: '1px solid var(--border)',
              color: 'var(--white)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', outline: 'none'
            }}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ background: 'var(--deep)', border: '1px solid var(--border)', color: 'var(--white)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}>
            <option value="">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="resolved">مكتمل</option>
          </select>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
            style={{ background: 'var(--deep)', border: '1px solid var(--border)', color: 'var(--white)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}>
            <option value="">كل المنصات</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={fetchData}
            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '10px 18px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
            تحديث
          </button>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1rem' }}>
              الطلبات <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({filtered.length})</span>
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--deep)' }}>
                  {['الاسم', 'الإيميل', 'المنصة', 'الخدمة', 'المشكلة', 'الحالة', 'التاريخ', 'الإجراءات'].map(col => (
                    <th key={col} style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ جارٍ التحميل...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>لا توجد طلبات</td></tr>
                ) : filtered.map((req, i) => (
                  <tr key={req.id}
                    style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--white)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{req.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '0.85rem' }}>{req.email}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text)', fontSize: '0.85rem' }}>{req.platform}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{req.service}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{req.problem_type}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: STATUS_BG[req.status] || 'rgba(255,255,255,0.05)',
                        color: STATUS_COLORS[req.status] || 'var(--muted)',
                        border: `1px solid ${STATUS_COLORS[req.status] || 'var(--border)'}`,
                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap'
                      }}>
                        {STATUS_LABELS[req.status] || req.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {new Date(req.created_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                        {req.status !== 'in_progress' && (
                          <button onClick={() => handleStatusChange(req.id, 'in_progress')}
                            disabled={updatingId === req.id}
                            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            تنفيذ
                          </button>
                        )}
                        {req.status !== 'resolved' && (
                          <button onClick={() => handleStatusChange(req.id, 'resolved')}
                            disabled={updatingId === req.id}
                            style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid var(--green)', color: 'var(--green)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            حُلّ
                          </button>
                        )}
                        {req.status !== 'pending' && (
                          <button onClick={() => handleStatusChange(req.id, 'pending')}
                            disabled={updatingId === req.id}
                            style={{ background: 'rgba(255,214,0,0.1)', border: '1px solid var(--yellow)', color: 'var(--yellow)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                            انتظار
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
