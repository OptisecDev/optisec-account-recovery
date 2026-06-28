import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'

const PLATFORMS = ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'X (Twitter)', 'LinkedIn', 'Snapchat']
const PROBLEM_TYPES = ['حساب محظور', 'حساب مخترق', 'فقدان الوصول', 'إشعار انتهاك', 'تعليق الحساب', 'مشكلة أخرى']
const SERVICES = ['تشخيص الحساب', 'خطة الاسترجاع', 'حماية الحساب', 'باقة VIP']

const AR = {
  logo: 'OPTISEC',
  logoSub: 'RECOVERY',
  navServices: 'الخدمات',
  navHow: 'كيف يعمل',
  navTrack: 'تتبع طلبك',
  navBreach: 'فحص التسريبات',
  navRequest: 'اطلب الآن',
  badge: 'OPTISEC ACCOUNT RECOVERY SYSTEM v2.0',
  heroTitle1: 'حسابك محظور؟',
  heroTitle2: 'نحن نستعيده لك',
  heroDesc: 'فريق متخصص في استرجاع وحماية حسابات التواصل الاجتماعي المحظورة',
  stat1: '+500 حساب مسترجع',
  stat2: '92% نسبة نجاح',
  stat3: '24h وقت استجابة',
  btnStart: 'ابدأ الاسترجاع الآن',
  btnServices: 'عرض الخدمات',
  platformsTitle: 'المنصات المدعومة',
  servicesTitle: 'خدماتنا',
  howTitle: 'كيف يعمل النظام',
  testimonialsTitle: 'ماذا يقول عملاؤنا',
  formTitle: 'اطلب الخدمة الآن',
  formName: 'الاسم الكامل',
  formEmail: 'البريد الإلكتروني',
  formPhone: 'رقم الواتساب',
  formPlatform: 'اختر المنصة',
  formProblem: 'نوع المشكلة',
  formService: 'الخدمة المطلوبة',
  formDesc: 'وصف المشكلة',
  formSubmit: 'إرسال الطلب',
  formSuccess: 'تم إرسال طلبك بنجاح! سيتواصل معك فريقنا خلال 24 ساعة.',
  footerDesc: 'منصة متخصصة في استرجاع وحماية حسابات التواصل الاجتماعي',
  footerLinks: 'روابط سريعة',
  footerTrack: 'تتبع طلبك',
  footerAdmin: 'لوحة التحكم',
  footerRights: '© 2026 OPTISEC. جميع الحقوق محفوظة.',
}

const EN = {
  logo: 'OPTISEC',
  logoSub: 'RECOVERY',
  navServices: 'Services',
  navHow: 'How It Works',
  navTrack: 'Track Request',
  navBreach: 'Breach Check',
  navRequest: 'Request Now',
  badge: 'OPTISEC ACCOUNT RECOVERY SYSTEM v2.0',
  heroTitle1: 'Account Banned?',
  heroTitle2: 'We Recover It For You',
  heroDesc: 'Specialized team in recovering and protecting banned social media accounts',
  stat1: '+500 Accounts Recovered',
  stat2: '92% Success Rate',
  stat3: '24h Response Time',
  btnStart: 'Start Recovery Now',
  btnServices: 'View Services',
  platformsTitle: 'Supported Platforms',
  servicesTitle: 'Our Services',
  howTitle: 'How The System Works',
  testimonialsTitle: 'What Our Clients Say',
  formTitle: 'Request Service Now',
  formName: 'Full Name',
  formEmail: 'Email Address',
  formPhone: 'WhatsApp Number',
  formPlatform: 'Select Platform',
  formProblem: 'Problem Type',
  formService: 'Required Service',
  formDesc: 'Problem Description',
  formSubmit: 'Submit Request',
  formSuccess: 'Your request was sent successfully! Our team will contact you within 24 hours.',
  footerDesc: 'Specialized platform for recovering and protecting social media accounts',
  footerLinks: 'Quick Links',
  footerTrack: 'Track Request',
  footerAdmin: 'Admin Panel',
  footerRights: '© 2026 OPTISEC. All rights reserved.',
}

const platforms = [
  { emoji: '📘', name: 'Facebook' },
  { emoji: '📸', name: 'Instagram' },
  { emoji: '🎵', name: 'TikTok' },
  { emoji: '▶️', name: 'YouTube' },
  { emoji: '🐦', name: 'X (Twitter)' },
  { emoji: '💼', name: 'LinkedIn' },
  { emoji: '👻', name: 'Snapchat' },
]

const services = [
  { icon: '🔍', nameAr: 'تشخيص الحساب', nameEn: 'Account Diagnosis', price: '$5', descAr: 'تحليل كامل لسبب الحظر وتقرير مفصل', descEn: 'Full analysis of ban reason with detailed report' },
  { icon: '🔓', nameAr: 'خطة الاسترجاع', nameEn: 'Recovery Plan', price: '$15', descAr: 'خطة مخصصة خطوة بخطوة مع متابعة', descEn: 'Custom step-by-step plan with follow-up' },
  { icon: '🛡️', nameAr: 'حماية الحساب', nameEn: 'Account Protection', price: '$10/شهر', descAr: 'مراقبة شهرية وتنبيهات فورية', descEn: 'Monthly monitoring and instant alerts' },
  { icon: '💎', nameAr: 'باقة VIP', nameEn: 'VIP Package', price: '$45', descAr: 'تشخيص + استرجاع + حماية 3 أشهر', descEn: 'Diagnosis + Recovery + 3 months protection' },
  { icon: '🔒', nameAr: 'فحص التسريبات', nameEn: 'Breach Check', price: 'مجاني', priceEn: 'Free', descAr: 'تحقق إذا كان حسابك في تسريبات بيانات عالمية', descEn: 'Check if your account is in global data breaches', link: '/breach-check' },
]

const steps = [
  { num: '01', titleAr: 'أرسل طلبك', titleEn: 'Send Your Request', descAr: 'أملأ النموذج بتفاصيل حسابك والمشكلة التي تواجهها', descEn: 'Fill the form with your account details and problem' },
  { num: '02', titleAr: 'التشخيص خلال 24 ساعة', titleEn: 'Diagnosis within 24 Hours', descAr: 'يحلل فريقنا حالتك ويرسل لك تقرير مفصل', descEn: 'Our team analyzes your case and sends a detailed report' },
  { num: '03', titleAr: 'الخطة والتنفيذ', titleEn: 'Plan & Execution', descAr: 'ننفذ خطة الاسترجاع ونتابع معك حتى الحل', descEn: 'We execute the recovery plan and follow up until resolved' },
  { num: '04', titleAr: 'الحماية المستمرة', titleEn: 'Continuous Protection', descAr: 'نراقب حسابك ونحميه من أي تهديدات مستقبلية', descEn: 'We monitor and protect your account from future threats' },
]

const testimonials = [
  { name: 'أحمد الموسوي', city: 'بغداد', stars: 5, text: 'استرجعوا حساب انستغرام كان محظوراً منذ شهرين، خدمة احترافية وسريعة جداً' },
  { name: 'سارة الجبوري', city: 'البصرة', stars: 5, text: 'خدمة احترافية جداً وسريعة، النتيجة كانت أفضل من توقعاتي بكثير' },
  { name: 'محمد الخزاعي', city: 'أربيل', stars: 5, text: 'أنقذوا صفحة تيك توك عندي 200 ألف متابع كانت مهددة بالحذف، شكراً جزيلاً' },
]

export default function Home() {
  const [lang, setLang] = useState('ar')
  const t = lang === 'ar' ? AR : EN
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const formRef = useRef(null)
  const servicesRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '', phone: '', platform: '', problem_type: '', service: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [appeal, setAppeal] = useState({ platform: '', ban_type: '', ban_reason: '', account_age: '', followers: '', verified: false, language: 'Arabic' })
  const [appealLoading, setAppealLoading] = useState(false)
  const [appealResult, setAppealResult] = useState('')
  const [appealCopied, setAppealCopied] = useState(false)
  const [appealError, setAppealError] = useState('')

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }, [lang, dir])

  const handleGenerateAppeal = async (e) => {
    e.preventDefault()
    if (!appeal.platform || !appeal.ban_type || !appeal.ban_reason) {
      setAppealError('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    setAppealLoading(true)
    setAppealError('')
    setAppealResult('')
    try {
      const res = await axios.post(`${API_URL}/api/generate-appeal`, appeal)
      setAppealResult(res.data.appeal)
    } catch {
      setAppealError('حدث خطأ في توليد الرسالة، يرجى المحاولة مرة أخرى')
    } finally {
      setAppealLoading(false)
    }
  }

  const handleCopyAppeal = () => {
    navigator.clipboard.writeText(appealResult)
    setAppealCopied(true)
    setTimeout(() => setAppealCopied(false), 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const required = ['name', 'email', 'phone', 'platform', 'problem_type', 'service']
    for (const f of required) {
      if (!form[f]) { setError('يرجى ملء جميع الحقول المطلوبة'); return }
    }
    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/requests`, form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', platform: '', problem_type: '', service: '', description: '' })
    } catch {
      setError('حدث خطأ في الإرسال، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ direction: dir, fontFamily: lang === 'ar' ? "'Cairo', sans-serif" : "'Rajdhani', sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(5, 8, 16, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px'
      }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.3rem', letterSpacing: '2px' }}>
          <span style={{ color: 'var(--cyan)' }}>OPTISEC</span>
          <span style={{ color: 'var(--white)', marginRight: '6px', marginLeft: '6px' }}>RECOVERY</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#services" style={{ color: 'var(--text)', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = 'var(--cyan)'}
            onMouseOut={e => e.target.style.color = 'var(--text)'}>{t.navServices}</a>
          <a href="#how" style={{ color: 'var(--text)', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = 'var(--cyan)'}
            onMouseOut={e => e.target.style.color = 'var(--text)'}>{t.navHow}</a>
          <Link to="/track" style={{ color: 'var(--text)', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = 'var(--cyan)'}
            onMouseOut={e => e.target.style.color = 'var(--text)'}>{t.navTrack}</Link>
          <Link to="/breach-check" style={{ color: 'var(--text)', fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = 'var(--cyan)'}
            onMouseOut={e => e.target.style.color = 'var(--text)'}>{t.navBreach}</Link>
          <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'var(--cyan)', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem' }}>
            {t.navRequest}
          </button>
          <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--cyan)', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: '80px',
        background: 'linear-gradient(180deg, #050810 0%, #0a0f1e 100%)'
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Scanline */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px', zIndex: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)',
          animation: 'scanline 8s linear infinite'
        }} />
        <style>{`
          @keyframes scanline { 0% { top: -2px; } 100% { top: 100%; } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 1.5rem' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block', marginBottom: '1.5rem',
            background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)',
            borderRadius: '20px', padding: '6px 18px',
            fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: 'var(--cyan)',
            letterSpacing: '1px', animation: 'pulse 3s ease-in-out infinite'
          }}>
            {t.badge}
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.2rem' }}>
            <span style={{ color: 'var(--red)', display: 'block' }}>{t.heroTitle1}</span>
            <span style={{ color: 'var(--cyan)', display: 'block' }}>{t.heroTitle2}</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            {t.heroDesc}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {[t.stat1, t.stat2, t.stat3].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--cyan)', fontSize: '1.4rem', fontWeight: 700 }}>{stat.split(' ')[0]}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{stat.split(' ').slice(1).join(' ')}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'var(--cyan)', color: '#000', border: 'none',
                padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 0 20px rgba(0,229,255,0.4)', transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 35px rgba(0,229,255,0.7)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.4)'}
            >{t.btnStart}</button>
            <button onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', color: 'var(--cyan)',
                border: '1px solid var(--cyan)', padding: '14px 32px', borderRadius: '8px',
                fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.1)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
            >{t.btnServices}</button>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section style={{ padding: '5rem 2rem', background: 'var(--deep)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--white)' }}>
            {t.platformsTitle}
          </h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {platforms.map((p, i) => (
              <div key={i}
                style={{
                  background: 'var(--panel)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1.5rem 1.8rem', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.3s', minWidth: '120px'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'var(--cyan)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.2)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{p.emoji}</div>
                <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" ref={servicesRef} style={{ padding: '5rem 2rem', background: 'var(--black)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--white)' }}>
            {t.servicesTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {services.map((s, i) => {
              const cardInner = (
                <div
                  style={{
                    background: 'var(--panel)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '2rem', transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                    height: '100%'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderTopColor = 'var(--cyan)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,229,255,0.15)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderTopColor = 'var(--border)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{s.icon}</div>
                  <h3 style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {lang === 'ar' ? s.nameAr : s.nameEn}
                  </h3>
                  <div style={{ color: 'var(--cyan)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.8rem', fontFamily: "'Share Tech Mono', monospace" }}>
                    {lang === 'ar' ? s.price : (s.priceEn || s.price)}
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {lang === 'ar' ? s.descAr : s.descEn}
                  </p>
                  {s.link && (
                    <div style={{ marginTop: '1rem', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {lang === 'ar' ? 'ابدأ الفحص ←' : 'Start Check →'}
                    </div>
                  )}
                </div>
              )
              return s.link ? (
                <Link key={i} to={s.link} style={{ textDecoration: 'none' }}>{cardInner}</Link>
              ) : (
                <div key={i}>{cardInner}</div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Appeal Generator */}
      <section id="appeal" style={{ padding: '5rem 2rem', background: 'var(--deep)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block', marginBottom: '1rem',
              background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)',
              borderRadius: '20px', padding: '5px 16px',
              fontFamily: "'Share Tech Mono', monospace", fontSize: '0.72rem', color: 'var(--cyan)', letterSpacing: '1px'
            }}>AI APPEAL GENERATOR v1.0</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.8rem' }}>
              مولّد رسائل الاستئناف بالذكاء الاصطناعي
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
              أدخل تفاصيل حسابك المحظور وسيقوم الذكاء الاصطناعي بكتابة رسالة استئناف احترافية ومقنعة
            </p>
          </div>

          <form onSubmit={handleGenerateAppeal} style={{
            background: 'var(--panel)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>المنصة *</label>
                <select value={appeal.platform} onChange={e => setAppeal(a => ({ ...a, platform: e.target.value }))}
                  style={{ width: '100%', background: 'var(--deep)', border: '1px solid var(--border)', color: appeal.platform ? 'var(--white)' : 'var(--muted)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}>
                  <option value="">اختر المنصة</option>
                  {['Facebook', 'Instagram', 'TikTok', 'YouTube', 'X (Twitter)', 'LinkedIn', 'Snapchat'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>نوع الحظر *</label>
                <select value={appeal.ban_type} onChange={e => setAppeal(a => ({ ...a, ban_type: e.target.value }))}
                  style={{ width: '100%', background: 'var(--deep)', border: '1px solid var(--border)', color: appeal.ban_type ? 'var(--white)' : 'var(--muted)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}>
                  <option value="">اختر نوع الحظر</option>
                  {['حظر دائم', 'حظر مؤقت', 'تعطيل الحساب', 'تقييد المحتوى', 'إزالة الصفحة'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>سبب الحظر المذكور من المنصة *</label>
              <textarea value={appeal.ban_reason} onChange={e => setAppeal(a => ({ ...a, ban_reason: e.target.value }))}
                placeholder="اذكر السبب الذي أوضحته المنصة عند الحظر..."
                rows={3}
                style={{ width: '100%', background: 'var(--deep)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>عمر الحساب</label>
                <input value={appeal.account_age} onChange={e => setAppeal(a => ({ ...a, account_age: e.target.value }))}
                  placeholder="مثال: 3 سنوات"
                  style={{ width: '100%', background: 'var(--deep)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>عدد المتابعين</label>
                <input value={appeal.followers} onChange={e => setAppeal(a => ({ ...a, followers: e.target.value }))}
                  placeholder="مثال: 50,000"
                  style={{ width: '100%', background: 'var(--deep)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>لغة الرسالة</label>
                <select value={appeal.language} onChange={e => setAppeal(a => ({ ...a, language: e.target.value }))}
                  style={{ width: '100%', background: 'var(--deep)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}>
                  <option value="Arabic">عربية</option>
                  <option value="English">English</option>
                  <option value="Both">كلاهما</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <input type="checkbox" id="verified-check" checked={appeal.verified}
                onChange={e => setAppeal(a => ({ ...a, verified: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: 'var(--cyan)', flexShrink: 0 }} />
              <label htmlFor="verified-check" style={{ color: 'var(--text)', fontSize: '0.95rem', cursor: 'pointer' }}>
                الحساب كان مُعتمداً (Verified ✓)
              </label>
            </div>

            {appealError && <div style={{ color: 'var(--red)', fontSize: '0.9rem', textAlign: 'center' }}>{appealError}</div>}

            <button type="submit" disabled={appealLoading}
              style={{
                background: appealLoading ? 'var(--border)' : 'var(--cyan)', color: '#000',
                border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700,
                fontSize: '1.05rem', transition: 'all 0.2s',
                boxShadow: appealLoading ? 'none' : '0 0 20px rgba(0,229,255,0.4)'
              }}>
              {appealLoading ? '⏳ جارٍ التوليد...' : '✨ توليد الرسالة'}
            </button>
          </form>

          {appealResult && (
            <div style={{
              marginTop: '1.5rem', background: 'var(--panel)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                <h3 style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '1rem' }}>✅ الرسالة المولّدة</h3>
                <button onClick={handleCopyAppeal}
                  style={{
                    background: appealCopied ? 'rgba(0,230,118,0.15)' : 'rgba(0,229,255,0.1)',
                    border: `1px solid ${appealCopied ? 'var(--green)' : 'var(--cyan)'}`,
                    color: appealCopied ? 'var(--green)' : 'var(--cyan)',
                    padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s'
                  }}>
                  {appealCopied ? '✅ تم النسخ!' : '📋 نسخ الرسالة'}
                </button>
              </div>
              <pre style={{
                color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.85,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
                fontFamily: "'Cairo', sans-serif"
              }}>
                {appealResult}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ padding: '5rem 2rem', background: 'var(--deep)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--white)' }}>
            {t.howTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1.5rem', position: 'relative' }}>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: '4rem', fontWeight: 700,
                  color: 'rgba(0,229,255,0.08)', lineHeight: 1, marginBottom: '-0.5rem'
                }}>{step.num}</div>
                <h3 style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem' }}>
                  {lang === 'ar' ? step.titleAr : step.titleEn}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {lang === 'ar' ? step.descAr : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 2rem', background: 'var(--black)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--white)' }}>
            {t.testimonialsTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t2, i) => (
              <div key={i} style={{
                background: 'var(--panel)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '1.8rem'
              }}>
                <div style={{ color: 'var(--yellow)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  {'★'.repeat(t2.stars)}
                </div>
                <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  "{t2.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--cyan), var(--cyan2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#000', fontWeight: 700, fontSize: '1rem'
                  }}>{t2.name[0]}</div>
                  <div>
                    <div style={{ color: 'var(--white)', fontWeight: 700 }}>{t2.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{t2.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section ref={formRef} style={{ padding: '5rem 2rem', background: 'var(--deep)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--white)' }}>
            {t.formTitle}
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
            أملأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة
          </p>

          {success ? (
            <div style={{
              background: 'rgba(0,230,118,0.1)', border: '1px solid var(--green)',
              borderRadius: '12px', padding: '2rem', textAlign: 'center', color: 'var(--green)', fontSize: '1.05rem'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
              {t.formSuccess}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t.formName} *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder={t.formName}
                    style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t.formEmail} *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder={t.formEmail}
                    style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t.formPhone} *</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+964 XXX XXX XXXX"
                  style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t.formPlatform} *</label>
                  <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                    style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--border)', color: form.platform ? 'var(--white)' : 'var(--muted)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}>
                    <option value="">{t.formPlatform}</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t.formProblem} *</label>
                  <select value={form.problem_type} onChange={e => setForm(f => ({ ...f, problem_type: e.target.value }))}
                    style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--border)', color: form.problem_type ? 'var(--white)' : 'var(--muted)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}>
                    <option value="">{t.formProblem}</option>
                    {PROBLEM_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t.formService} *</label>
                <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                  style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--border)', color: form.service ? 'var(--white)' : 'var(--muted)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}>
                  <option value="">{t.formService}</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t.formDesc}</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder={t.formDesc} rows={4}
                  style={{ width: '100%', background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--white)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }} />
              </div>
              {error && <div style={{ color: 'var(--red)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{
                  background: loading ? 'var(--border)' : 'var(--cyan)', color: '#000',
                  border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700,
                  fontSize: '1.05rem', transition: 'all 0.2s',
                  boxShadow: loading ? 'none' : '0 0 20px rgba(0,229,255,0.4)'
                }}>
                {loading ? '⏳ جارٍ الإرسال...' : t.formSubmit}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#020508', borderTop: '1px solid var(--border)', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.3rem', letterSpacing: '2px', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--cyan)' }}>OPTISEC</span>
                <span style={{ color: 'var(--white)', marginRight: '6px', marginLeft: '6px' }}>RECOVERY</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{t.footerDesc}</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--white)', fontWeight: 700, marginBottom: '1rem' }}>{t.footerLinks}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <a href="#services" style={{ color: 'var(--muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = 'var(--cyan)'}
                  onMouseOut={e => e.target.style.color = 'var(--muted)'}>{t.navServices}</a>
                <Link to="/track" style={{ color: 'var(--muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = 'var(--cyan)'}
                  onMouseOut={e => e.target.style.color = 'var(--muted)'}>{t.footerTrack}</Link>
                <Link to="/admin" style={{ color: 'var(--muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = 'var(--cyan)'}
                  onMouseOut={e => e.target.style.color = 'var(--muted)'}>{t.footerAdmin}</Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
            {t.footerRights}
          </div>
        </div>
      </footer>
    </div>
  )
}
