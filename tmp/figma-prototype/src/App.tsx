import { useState, useEffect, useRef, useCallback } from 'react'

// ── Theme ────────────────────────────────────────────────────────────────────
type Theme = 'dark' | 'light'

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return [theme, () => setTheme(t => t === 'dark' ? 'light' : 'dark')]
}

// ── Types ────────────────────────────────────────────────────────────────────
type View = 'dashboard' | 'register' | 'log' | 'history'

interface Visitor {
  id: string
  name: string
  nationalId: string
  phone: string
  host: string
  department: string
  purpose: string
  laptop: boolean
  laptopSerial: string
  passNumber: string
  passReturned: boolean
  timeIn: string
  timeOut: string | null
  date: string
  status: 'active' | 'checked-out'
  notes: string
}

interface Notification {
  id: string
  host: string
  visitor: string
  message: string
  time: string
  read: boolean
}

// ── Seed data ────────────────────────────────────────────────────────────────
const TODAY = '2026-08-15'

const SEED: Visitor[] = [
  { id: 'V001', name: 'Sarah Al-Rashidi',   nationalId: '1092837465', phone: '+966 50 123 4567', host: 'Ahmed Al-Farsi',    department: 'Finance',    purpose: 'Business Meeting', laptop: true,  laptopSerial: 'MBP-2024-XR9',  passNumber: 'P-0041', passReturned: false, timeIn: '08:14', timeOut: null,    date: TODAY,        status: 'active',      notes: '' },
  { id: 'V002', name: 'James Okonkwo',      nationalId: '2038471650', phone: '+966 55 987 6543', host: 'Leila Mustafa',     department: 'IT',         purpose: 'IT Support',       laptop: false, laptopSerial: '',               passNumber: 'P-0042', passReturned: false, timeIn: '09:02', timeOut: null,    date: TODAY,        status: 'active',      notes: '' },
  { id: 'V003', name: 'Maria Santos',       nationalId: '3091827364', phone: '+966 54 456 7890', host: 'Khalid Bin Nasser', department: 'Compliance', purpose: 'Audit',            laptop: true,  laptopSerial: 'DELL-INS-887',   passNumber: 'P-0039', passReturned: true,  timeIn: '07:50', timeOut: '12:30', date: TODAY,        status: 'checked-out', notes: '' },
  { id: 'V004', name: 'Rami Al-Amin',       nationalId: '1837465029', phone: '+966 58 234 5678', host: 'Sara Al-Kindi',     department: 'Operations', purpose: 'Delivery',         laptop: false, laptopSerial: '',               passNumber: 'P-0040', passReturned: true,  timeIn: '11:45', timeOut: '12:05', date: TODAY,        status: 'checked-out', notes: 'Package delivered to reception.' },
  { id: 'V005', name: 'Priya Nair',         nationalId: '9082736450', phone: '+966 56 678 1234', host: 'Omar Bin Khalid',   department: 'HR',         purpose: 'Interview',        laptop: false, laptopSerial: '',               passNumber: 'P-0043', passReturned: false, timeIn: '13:20', timeOut: null,    date: TODAY,        status: 'active',      notes: '' },
  { id: 'V006', name: 'David Park',         nationalId: '5047382910', phone: '+966 50 321 9876', host: 'Nadia Al-Jaber',    department: 'Legal',      purpose: 'Contract Review',  laptop: true,  laptopSerial: 'LEN-T14-005',    passNumber: 'P-0037', passReturned: true,  timeIn: '09:15', timeOut: '16:40', date: '2026-08-14', status: 'checked-out', notes: '' },
  { id: 'V007', name: 'Fatima Al-Zahra',    nationalId: '7261038495', phone: '+966 54 888 2233', host: 'Ahmed Al-Farsi',    department: 'Finance',    purpose: 'Business Meeting', laptop: false, laptopSerial: '',               passNumber: 'P-0036', passReturned: true,  timeIn: '10:00', timeOut: '14:00', date: '2026-08-14', status: 'checked-out', notes: '' },
  { id: 'V008', name: 'Carlos Mendez',      nationalId: '6183049275', phone: '+966 58 112 4455', host: 'Leila Mustafa',     department: 'IT',         purpose: 'Maintenance',      laptop: true,  laptopSerial: 'HP-ELT-X360',    passNumber: 'P-0035', passReturned: true,  timeIn: '08:30', timeOut: '17:00', date: '2026-08-13', status: 'checked-out', notes: 'Server rack maintenance.' },
]

const SEED_NOTIFS: Notification[] = [
  { id: 'N1', host: 'Ahmed Al-Farsi',    visitor: 'Sarah Al-Rashidi', message: 'Your visitor Sarah Al-Rashidi has arrived and is waiting at reception.', time: '08:14', read: false },
  { id: 'N2', host: 'Leila Mustafa',     visitor: 'James Okonkwo',   message: 'Your visitor James Okonkwo checked in at 09:02.',                         time: '09:02', read: false },
  { id: 'N3', host: 'Omar Bin Khalid',   visitor: 'Priya Nair',      message: 'Priya Nair has arrived for their 13:20 interview appointment.',            time: '13:20', read: true  },
  { id: 'N4', host: 'Khalid Bin Nasser', visitor: 'Maria Santos',    message: 'Maria Santos checked out at 12:30. Pass P-0039 returned.',                time: '12:30', read: true  },
]

// ── Style helpers ────────────────────────────────────────────────────────────
const css = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 } as React.CSSProperties,
  label: { fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', display: 'block', marginBottom: 6 } as React.CSSProperties,
  input: { width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 7, padding: '9px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', transition: 'border-color 0.15s' } as React.CSSProperties,
  mono: { fontFamily: 'JetBrains Mono, monospace' } as React.CSSProperties,
}

function badge(label: string, color: string, dimColor: string) {
  return (
    <span style={{ fontSize: 10, color, background: dimColor, padding: '2px 8px', borderRadius: 20, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>
      {label}
    </span>
  )
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function now() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function nextPass(visitors: Visitor[]) {
  const nums = visitors.map(v => parseInt(v.passNumber.replace('P-', ''))).filter(Boolean)
  return `P-${String(Math.max(0, ...nums) + 1).padStart(4, '0')}`
}

// ── Theme toggle ─────────────────────────────────────────────────────────────
function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button onClick={toggle} title="Toggle theme" style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--toggle-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s', flexShrink: 0 }}>
      {theme === 'dark'
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      }
    </button>
  )
}

// ── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin, theme, toggleTheme }: { onLogin: (role: string) => void; theme: Theme; toggleTheme: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [role, setRole] = useState<'receptionist' | 'security'>('receptionist')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--cyan-glow) 1px, transparent 1px), linear-gradient(90deg, var(--cyan-glow) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'radial-gradient(circle, var(--cyan-dim) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* theme toggle top-right */}
      <div style={{ position: 'fixed', top: 20, right: 20 }}>
        <ThemeToggle theme={theme} toggle={toggleTheme} />
      </div>

      <div className="fadein" style={{ position: 'relative', width: 420, ...css.card, padding: 40, boxShadow: 'var(--shadow)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, background: 'var(--cyan-dim)', border: '1px solid var(--cyan)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 19, color: 'var(--text)', letterSpacing: '-0.4px' }}>SmartEntry</div>
            <div style={{ fontSize: 10, color: 'var(--cyan)', ...css.mono, letterSpacing: '0.1em' }}>VISITOR MANAGEMENT · v1.0</div>
          </div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Sign in to access the security console</p>

        {/* Role */}
        <div style={{ display: 'flex', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 3, marginBottom: 22, gap: 3 }}>
          {(['receptionist', 'security'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', background: role === r ? 'var(--surface)' : 'transparent', color: role === r ? 'var(--text)' : 'var(--text-muted)', fontSize: 12, fontWeight: role === r ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', borderTop: role === r ? '1px solid var(--border)' : '1px solid transparent' }}>
              {r === 'receptionist' ? 'Receptionist' : 'Security Officer'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={css.label}>USERNAME</label>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="Enter username" style={css.input} />
          </div>
          <div>
            <label style={css.label}>PASSWORD</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && onLogin(role)} style={css.input} />
          </div>
          <button onClick={() => onLogin(role)} style={{ marginTop: 4, background: 'var(--cyan)', color: theme === 'dark' ? '#080c17' : '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: '0.02em', transition: 'opacity 0.15s' }}>
            Sign In
          </button>
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: 'var(--border-mid)', textAlign: 'center', ...css.mono }}>
          ORG-KSA-007 · Al-Noor Corporate Tower
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  {
    key: 'dashboard', label: 'Dashboard',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    key: 'register', label: 'Register Visitor',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
  },
  {
    key: 'log', label: 'Visitor Log',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
  {
    key: 'history', label: 'Visit History',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  },
]

function Sidebar({ view, setView, notifs, theme, toggleTheme, role, onLogout }: {
  view: View; setView: (v: View) => void; notifs: Notification[]; theme: Theme; toggleTheme: () => void; role: string; onLogout: () => void
}) {
  const unread = notifs.filter(n => !n.read).length

  return (
    <div style={{ width: 226, background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 20 }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--cyan-dim)', border: '1px solid var(--cyan)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>SmartEntry</div>
            <div style={{ fontSize: 9, color: 'var(--cyan)', ...css.mono, letterSpacing: '0.1em', opacity: 0.8 }}>PART ONE</div>
          </div>
        </div>
      </div>

      {/* Live */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-ring 1.6s ease-out infinite', opacity: 0.5 }} />
          <div style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', zIndex: 1 }} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--green)', ...css.mono, letterSpacing: '0.07em' }}>SYSTEM ONLINE</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(n => {
          const active = view === n.key
          return (
            <button key={n.key} onClick={() => setView(n.key as View)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7, border: 'none', background: active ? 'rgba(0,200,215,0.12)' : 'transparent', color: active ? 'var(--cyan)' : 'rgba(255,255,255,0.4)', fontWeight: active ? 600 : 400, fontSize: 13, cursor: 'pointer', textAlign: 'left', borderLeft: `2px solid ${active ? 'var(--cyan)' : 'transparent'}`, transition: 'all 0.12s' }}>
              {n.icon}
              {n.label}
              {n.key === 'dashboard' && unread > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', ...css.mono }}>{unread}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cyan-dim)', border: '1px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--cyan)', flexShrink: 0 }}>NH</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 500 }}>Noor Al-Hassan</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{role}</div>
          </div>
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
        <button onClick={onLogout} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '7px 0', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

// ── Header ───────────────────────────────────────────────────────────────────
function Header({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', ...css.mono, letterSpacing: '0.09em', marginBottom: 4 }}>{sub}</div>}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>{title}</h1>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ visitors, notifs, onMarkRead, setView }: {
  visitors: Visitor[]; notifs: Notification[]; onMarkRead: (id: string) => void; setView: (v: View) => void
}) {
  const todayV = visitors.filter(v => v.date === TODAY)
  const active = todayV.filter(v => v.status === 'active')
  const checkedOut = todayV.filter(v => v.status === 'checked-out')
  const withLaptop = todayV.filter(v => v.laptop)
  const unread = notifs.filter(n => !n.read)

  return (
    <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Header title="Dashboard" sub={`${TODAY} · Al-Noor Corporate Tower`} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Active On-Site', value: active.length, color: 'var(--cyan)', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { label: 'Checked Out', value: checkedOut.length, color: 'var(--green)', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> },
          { label: 'Total Today', value: todayV.length, color: 'var(--text-sub)', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { label: 'Laptops Registered', value: withLaptop.length, color: 'var(--amber)', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg> },
        ].map(s => (
          <div key={s.label} style={{ ...css.card, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', ...css.mono, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</span>
              <span style={{ color: s.color, opacity: 0.7 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, color: s.color, letterSpacing: '-1.5px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
        {/* Active visitors */}
        <div style={css.card}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Active Visitors</span>
            <button onClick={() => setView('log')} style={{ fontSize: 10, color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer', ...css.mono, letterSpacing: '0.06em' }}>SEE ALL →</button>
          </div>
          {active.length === 0 && <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No active visitors on-site.</div>}
          {active.map((v, i) => (
            <div key={v.id} style={{ padding: '12px 20px', borderBottom: i < active.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.1s' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cyan-dim)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: 'var(--cyan)', flexShrink: 0 }}>
                {initials(v.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{v.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Host: {v.host} · {v.department} · {v.purpose}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--cyan)', ...css.mono }}>IN {v.timeIn}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{v.passNumber}</div>
              </div>
              {v.laptop && <span title="Laptop registered" style={{ color: 'var(--amber)', opacity: 0.7, flexShrink: 0 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg></span>}
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div style={css.card}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Host Notifications</span>
            {unread.length > 0 && <span style={{ fontSize: 10, color: 'var(--red)', ...css.mono }}>{unread.length} UNREAD</span>}
          </div>
          {notifs.map((n, i) => (
            <div key={n.id} onClick={() => onMarkRead(n.id)} style={{ padding: '12px 18px', borderBottom: i < notifs.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', background: n.read ? 'transparent' : 'var(--cyan-dim)', transition: 'background 0.15s', borderLeft: n.read ? '3px solid transparent' : '3px solid var(--cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{n.host}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', ...css.mono }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-sub)', lineHeight: 1.45 }}>{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Register Visitor ──────────────────────────────────────────────────────────
function RegisterVisitor({ visitors, onRegister, onNotify }: {
  visitors: Visitor[]; onRegister: (v: Visitor) => void; onNotify: (n: Notification) => void
}) {
  const emptyForm = { name: '', nationalId: '', phone: '', host: '', department: '', purpose: '', laptop: false, laptopSerial: '', notes: '' }
  const [form, setForm] = useState({ ...emptyForm })
  const [success, setSuccess] = useState<Visitor | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const set = (k: string, v: string | boolean) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: false })) }

  const validate = () => {
    const e: Record<string, boolean> = {}
    if (!form.name.trim()) e.name = true
    if (!form.nationalId.trim()) e.nationalId = true
    if (!form.host.trim()) e.host = true
    if (!form.purpose) e.purpose = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    const t = now()
    const v: Visitor = {
      id: `V${String(visitors.length + 1).padStart(3, '0')}`,
      ...form, passNumber: nextPass(visitors), passReturned: false, timeIn: t, timeOut: null, date: TODAY, status: 'active',
    }
    onRegister(v)
    onNotify({ id: `N${Date.now()}`, host: v.host, visitor: v.name, message: `Your visitor ${v.name} has arrived and is waiting at reception. Pass ${v.passNumber} issued.`, time: t, read: false })
    setSuccess(v)
    setForm({ ...emptyForm })
  }

  const fieldStyle = (k: string) => ({ ...css.input, borderColor: errors[k] ? 'var(--red)' : 'var(--border)' })

  const SelectField = ({ label, k, options }: { label: string; k: string; options: string[] }) => (
    <div>
      <label style={css.label}>{label}</label>
      <select value={(form as Record<string, string | boolean>)[k] as string} onChange={e => set(k, e.target.value)} style={{ ...fieldStyle(k), appearance: 'none' }}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Header title="Register New Visitor" sub="VISITOR MANAGEMENT" />

      {success && (
        <div style={{ background: 'var(--green-dim)', border: '1px solid var(--green)', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)', marginBottom: 4 }}>Visitor registered — Pass {success.passNumber} issued</div>
            <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>{success.name} checked in at {success.timeIn}. Host {success.host} has been notified.</div>
            {success.laptop && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, ...css.mono }}>Laptop: {success.laptopSerial}</div>}
          </div>
          <button onClick={() => setSuccess(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}>✕</button>
        </div>
      )}

      <div style={{ ...css.card, padding: 28 }}>
        <SectionLabel label="PERSONAL INFORMATION" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={css.label}>FULL NAME *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sarah Al-Rashidi" style={fieldStyle('name')} />
          </div>
          <div>
            <label style={css.label}>NATIONAL ID *</label>
            <input value={form.nationalId} onChange={e => set('nationalId', e.target.value)} placeholder="10-digit national ID" style={{ ...fieldStyle('nationalId'), ...css.mono }} />
          </div>
          <div>
            <label style={css.label}>PHONE NUMBER</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+966 5X XXX XXXX" style={fieldStyle('phone')} />
          </div>
          <SelectField label="PURPOSE OF VISIT *" k="purpose" options={['Business Meeting', 'IT Support', 'Audit', 'Delivery', 'Interview', 'Maintenance', 'Training', 'Other']} />
        </div>

        <SectionLabel label="HOST INFORMATION" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={css.label}>HOST NAME *</label>
            <input value={form.host} onChange={e => set('host', e.target.value)} placeholder="Employee receiving the visitor" style={fieldStyle('host')} />
          </div>
          <SelectField label="HOST DEPARTMENT" k="department" options={['Finance', 'IT', 'HR', 'Legal', 'Compliance', 'Operations', 'Management', 'Other']} />
        </div>

        <SectionLabel label="DEVICE REGISTRATION" />
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <button onClick={() => set('laptop', !form.laptop)} style={{ width: 42, height: 23, borderRadius: 12, border: 'none', background: form.laptop ? 'var(--cyan)' : 'var(--toggle-bg)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: form.laptop ? 22 : 3, width: 17, height: 17, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
            </button>
            <span style={{ fontSize: 13, color: 'var(--text)' }}>Visitor is bringing a laptop</span>
          </div>
          {form.laptop && (
            <div>
              <label style={css.label}>LAPTOP SERIAL / ASSET TAG</label>
              <input value={form.laptopSerial} onChange={e => set('laptopSerial', e.target.value)} placeholder="e.g. MBP-2024-XR9" style={{ ...css.input, ...css.mono }} />
            </div>
          )}
        </div>

        <SectionLabel label="NOTES (OPTIONAL)" />
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional information…" rows={3} style={{ ...css.input, resize: 'vertical', marginBottom: 24 }} />

        {Object.keys(errors).length > 0 && (
          <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 14 }}>Please fill in all required fields marked with *</div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={submit} style={{ background: 'var(--cyan)', color: 'var(--sidebar-bg)', border: 'none', borderRadius: 8, padding: '11px 28px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            Issue Pass &amp; Check In
          </button>
          <button onClick={() => { setForm({ ...emptyForm }); setErrors({}) }} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer' }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return <div style={{ fontSize: 10, color: 'var(--text-muted)', ...css.mono, letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 16 }}>{label}</div>
}

// ── Visitor Log ───────────────────────────────────────────────────────────────
function VisitorLog({ visitors, onCheckout, onReturnPass }: {
  visitors: Visitor[]; onCheckout: (id: string) => void; onReturnPass: (id: string) => void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'checked-out'>('all')
  const [selected, setSelected] = useState<Visitor | null>(null)

  const todayV = visitors.filter(v => v.date === TODAY)
  const filtered = todayV.filter(v => {
    const q = search.toLowerCase()
    const hit = !q || v.name.toLowerCase().includes(q) || v.host.toLowerCase().includes(q) || v.nationalId.includes(q) || v.passNumber.toLowerCase().includes(q)
    const sf = filter === 'all' || v.status === filter
    return hit && sf
  })

  return (
    <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Header title="Visitor Log" sub="TODAY'S VISITORS" />

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, host, national ID, or pass…" style={{ ...css.input, paddingLeft: 34 }} />
        </div>
        {(['all', 'active', 'checked-out'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid', borderColor: filter === f ? 'var(--cyan)' : 'var(--border)', background: filter === f ? 'var(--cyan-dim)' : 'transparent', color: filter === f ? 'var(--cyan)' : 'var(--text-muted)', fontSize: 12, fontWeight: filter === f ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {f === 'all' ? `All (${todayV.length})` : f === 'active' ? `Active (${todayV.filter(v => v.status === 'active').length})` : `Out (${todayV.filter(v => v.status === 'checked-out').length})`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 14, alignItems: 'start' }}>
        <div style={css.card}>
          {/* Table head */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 130px 90px 80px 80px 90px', padding: '9px 18px', background: 'var(--card)', borderBottom: '1px solid var(--border)', borderRadius: '10px 10px 0 0' }}>
            {['PASS', 'VISITOR / HOST', 'PURPOSE', 'TIME IN', 'TIME OUT', 'PASS', 'STATUS'].map(h => (
              <div key={h} style={{ fontSize: 10, color: 'var(--text-muted)', ...css.mono, letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0 && <div style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No visitors match.</div>}

          {filtered.map((v, i) => (
            <div key={v.id} onClick={() => setSelected(s => s?.id === v.id ? null : v)} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 130px 90px 80px 80px 90px', padding: '11px 18px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', cursor: 'pointer', background: selected?.id === v.id ? 'var(--cyan-dim)' : 'transparent', transition: 'background 0.1s' }}>
              <div style={{ ...css.mono, fontSize: 11, color: 'var(--cyan)' }}>{v.passNumber}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{v.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>→ {v.host} · {v.department}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>{v.purpose}</div>
              <div style={{ ...css.mono, fontSize: 12, color: 'var(--green)' }}>{v.timeIn}</div>
              <div style={{ ...css.mono, fontSize: 12, color: v.timeOut ? 'var(--text-muted)' : 'var(--border-mid)' }}>{v.timeOut ?? '—'}</div>
              <div>{v.passReturned ? badge('Returned', 'var(--text-muted)', 'var(--toggle-bg)') : badge('Issued', 'var(--amber)', 'var(--amber-dim)')}</div>
              <div>{v.status === 'active' ? badge('active', 'var(--green)', 'var(--green-dim)') : badge('out', 'var(--text-muted)', 'var(--toggle-bg)')}</div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ ...css.card, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }} className="fadein">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Visitor Detail</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--cyan-dim)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: 'var(--cyan)' }}>{initials(selected.name)}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', ...css.mono }}>{selected.nationalId}</div>
              </div>
            </div>

            {[
              ['Phone', selected.phone || '—'],
              ['Host', selected.host],
              ['Department', selected.department || '—'],
              ['Purpose', selected.purpose],
              ['Pass', selected.passNumber],
              ['Check-in', selected.timeIn],
              ['Check-out', selected.timeOut ?? 'Still on-site'],
            ].map(([k, val]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right', maxWidth: 160 }}>{val}</span>
              </div>
            ))}

            {selected.laptop && (
              <div style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber)', borderRadius: 7, padding: '8px 12px', fontSize: 11, color: 'var(--amber)' }}>
                Laptop registered: <span style={css.mono}>{selected.laptopSerial}</span>
              </div>
            )}

            {selected.notes && (
              <div style={{ fontSize: 11, color: 'var(--text-sub)', fontStyle: 'italic' }}>{selected.notes}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {selected.status === 'active' && (
                <button onClick={() => { onCheckout(selected.id); setSelected(v => v ? { ...v, status: 'checked-out', timeOut: now() } : null) }} style={{ background: 'var(--cyan)', color: 'var(--sidebar-bg)', border: 'none', borderRadius: 7, padding: '10px 0', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Check Out Visitor
                </button>
              )}
              {!selected.passReturned && (
                <button onClick={() => { onReturnPass(selected.id); setSelected(v => v ? { ...v, passReturned: true } : null) }} style={{ background: 'transparent', color: 'var(--amber)', border: '1px solid var(--amber)', borderRadius: 7, padding: '9px 0', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                  Mark Pass Returned
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Visit History ─────────────────────────────────────────────────────────────
function VisitHistory({ visitors }: { visitors: Visitor[] }) {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  const dates = [...new Set(visitors.map(v => v.date))].sort().reverse()
  const filtered = visitors.filter(v => {
    const q = search.toLowerCase()
    const hit = !q || v.name.toLowerCase().includes(q) || v.host.toLowerCase().includes(q) || v.nationalId.includes(q)
    const df = dateFilter === 'all' || v.date === dateFilter
    return hit && df
  }).sort((a, b) => b.date.localeCompare(a.date) || b.timeIn.localeCompare(a.timeIn))

  const byDate: Record<string, Visitor[]> = {}
  filtered.forEach(v => { if (!byDate[v.date]) byDate[v.date] = []; byDate[v.date].push(v) })

  return (
    <div className="fadein" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Header title="Visit History" sub="ALL RECORDS" />

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by visitor name, host, or national ID…" style={{ ...css.input, paddingLeft: 34 }} />
        </div>
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ ...css.input, width: 'auto', minWidth: 140 }}>
          <option value="all">All Dates</option>
          {dates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} visit{filtered.length !== 1 ? 's' : ''} found</div>

      {Object.entries(byDate).map(([date, vs]) => (
        <div key={date}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', ...css.mono, letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            {date}
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span>{vs.length} visits</span>
          </div>
          <div style={css.card}>
            {vs.map((v, i) => (
              <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px 80px 80px 80px', padding: '11px 18px', borderBottom: i < vs.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                <div style={{ ...css.mono, fontSize: 11, color: 'var(--cyan)' }}>{v.passNumber}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Host: {v.host} · {v.purpose}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>{v.department}</div>
                <div style={{ ...css.mono, fontSize: 12, color: 'var(--green)' }}>{v.timeIn}</div>
                <div style={{ ...css.mono, fontSize: 12, color: 'var(--text-muted)' }}>{v.timeOut ?? '—'}</div>
                <div>{v.passReturned ? badge('Returned', 'var(--text-muted)', 'var(--toggle-bg)') : badge('Not Returned', 'var(--amber)', 'var(--amber-dim)')}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ ...css.card, padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No records match your search.</div>
      )}
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState('receptionist')
  const [view, setView] = useState<View>('dashboard')
  const [visitors, setVisitors] = useState<Visitor[]>(SEED)
  const [notifs, setNotifs] = useState<Notification[]>(SEED_NOTIFS)

  if (!loggedIn) {
    return <Login onLogin={r => { setRole(r); setLoggedIn(true) }} theme={theme} toggleTheme={toggleTheme} />
  }

  const checkout = (id: string) => {
    const t = now()
    setVisitors(vs => vs.map(v => v.id === id ? { ...v, timeOut: t, status: 'checked-out' } : v))
  }

  const returnPass = (id: string) => {
    setVisitors(vs => vs.map(v => v.id === id ? { ...v, passReturned: true } : v))
  }

  const markRead = (id: string) => {
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', transition: 'background 0.2s' }}>
      <Sidebar view={view} setView={setView} notifs={notifs} theme={theme} toggleTheme={toggleTheme} role={role} onLogout={() => setLoggedIn(false)} />
      <main style={{ marginLeft: 226, flex: 1, padding: '32px 36px', minWidth: 0, maxWidth: 1200 }}>
        {view === 'dashboard' && <Dashboard visitors={visitors} notifs={notifs} onMarkRead={markRead} setView={setView} />}
        {view === 'register' && <RegisterVisitor visitors={visitors} onRegister={v => setVisitors(vs => [v, ...vs])} onNotify={n => setNotifs(ns => [n, ...ns])} />}
        {view === 'log' && <VisitorLog visitors={visitors} onCheckout={checkout} onReturnPass={returnPass} />}
        {view === 'history' && <VisitHistory visitors={visitors} />}
      </main>
    </div>
  )
}
