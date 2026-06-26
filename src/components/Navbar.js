import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState('All category');
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => { e.preventDefault(); navigate('/products'); };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: 'var(--blue)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 19 }}>Brand</span>
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 640 }} className="navbar-search">
          <input type="text" placeholder="Search" style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '6px 0 0 6px', outline: 'none', fontSize: 14, borderRight: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ appearance: 'none', border: 'none', background: 'transparent', padding: '10px 28px 10px 12px', fontSize: 13, color: 'var(--text-muted)', outline: 'none', cursor: 'pointer' }}>
              <option>All category</option>
              <option>Electronics</option>
              <option>Smartphones</option>
              <option>Clothing</option>
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: 'var(--text-light)' }} />
          </div>
          <button type="submit" className="btn-blue" style={{ borderRadius: '0 6px 6px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={15} /> <span className="search-btn-text">Search</span>
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }} className="navbar-icons">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ fontSize: 12, fontWeight: 600, background: 'var(--blue)', color: '#fff', padding: '6px 12px', borderRadius: 6 }}>Admin</Link>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--text-muted)' }}>
                <User size={19} strokeWidth={1.6} />
                <span style={{ fontSize: 11 }}>{user.name}</span>
              </div>
              <button onClick={logout} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--text-muted)' }}>
                <LogOut size={19} strokeWidth={1.6} />
                <span style={{ fontSize: 11 }}>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--text-muted)' }}>
              <User size={19} strokeWidth={1.6} />
              <span style={{ fontSize: 11 }}>Login</span>
            </Link>
          )}
          <Link to="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--text-muted)', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={19} strokeWidth={1.6} />
              {count > 0 && (
                <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--blue)', color: '#fff', fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
              )}
            </div>
            <span style={{ fontSize: 11 }}>My cart</span>
          </Link>
        </div>

        <button onClick={() => setMenuOpen(v => !v)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', display: 'none', color: 'var(--text)' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div style={{ borderTop: '1px solid #F3F4F6', maxWidth: 1280, margin: '0 auto', padding: '0 20px' }} className="category-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '10px 0', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            <Menu size={15} /> All category
          </div>
          {['Hot offers', 'Gift boxes', 'Projects', 'Menu item'].map(l => (
            <Link key={l} to="/products" style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }} className="link-hover">{l}</Link>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>Help <ChevronDown size={13} /></div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, flexShrink: 0 }} className="navbar-right-meta">
            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>English, USD <ChevronDown size={13} /></span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>Ship to 🇩🇪 <ChevronDown size={13} /></span>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Home', 'Products', 'Cart', user ? 'Logout' : 'Login'].map(l => (
            <Link key={l} to={l === 'Home' ? '/' : l === 'Logout' ? '/' : `/${l.toLowerCase()}`}
              onClick={l === 'Logout' ? logout : () => setMenuOpen(false)}
              style={{ fontSize: 14, fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
      )}

      <style>{`
        .mobile-menu-btn { display: none; }
        @media (max-width: 860px) {
          .navbar-search { display: none !important; }
          .navbar-icons { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .category-row { display: none !important; }
        }
        @media (max-width: 1100px) {
          .search-btn-text { display: none; }
          .navbar-right-meta { display: none !important; }
        }
      `}</style>
    </header>
  );
}
