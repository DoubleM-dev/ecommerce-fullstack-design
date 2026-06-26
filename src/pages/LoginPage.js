import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = isLogin ? await loginUser(email, password) : await registerUser(name, email, password);
      if (!res.success) { setError(res.message); }
      else { login(res.user, res.token); navigate(res.user.role==='admin' ? '/admin' : '/'); }
    } catch { setError('Cannot connect to backend. Make sure it is running on port 5000.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: 'var(--blue)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <ShoppingCart size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Brand</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '6px 0 0' }}>{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 8, padding: 4, marginBottom: 28 }}>
          {['Login','Register'].map(tab => (
            <button key={tab} onClick={() => { setIsLogin(tab==='Login'); setError(''); }}
              style={{ flex: 1, padding: '9px 0', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, background: (tab==='Login')===isLogin ? '#fff' : 'transparent', color: (tab==='Login')===isLogin ? 'var(--text)' : 'var(--text-muted)', boxShadow: (tab==='Login')===isLogin ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>{tab}</button>
          ))}
        </div>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: 'var(--red)' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '11px 40px 11px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPass(v=>!v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-blue" style={{ width: '100%', padding: 13, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {isLogin && (
          <div style={{ marginTop: 20, padding: 14, background: '#EFF6FF', borderRadius: 6, fontSize: 12, color: 'var(--blue)' }}>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--blue)' }}>← Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
