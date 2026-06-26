import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShoppingCart, Apple, PlayCircle, Share2, AtSign, Video } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ marginTop: 40 }}>
      <div style={{ background: '#F3F4F6', padding: '48px 20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Subscribe on our newsletter</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px' }}>Get daily news on upcoming offers from many suppliers all over the world</p>
        <div style={{ display: 'flex', maxWidth: 420, margin: '0 auto' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px 0 0 6px', padding: '0 14px', gap: 8 }}>
            <Mail size={15} color="var(--text-light)" />
            <input type="email" placeholder="Email" style={{ flex: 1, border: 'none', padding: '11px 0', outline: 'none', fontSize: 14 }} />
          </div>
          <button className="btn-blue" style={{ borderRadius: '0 6px 6px 0' }}>Subscribe</button>
        </div>
      </div>
      <div style={{ background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, background: 'var(--blue)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={15} color="#fff" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 17 }}>Brand</span>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 16px' }}>Best information about the company gies here but now lorem ipsum is</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[Share2, AtSign, Video].map((Icon, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>
          {[
            { title: 'About', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
            { title: 'Partnership', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
            { title: 'Information', links: ['Help Center', 'Money Refund', 'Shipping', 'Contact us'] },
            { title: 'For users', links: ['Login', 'Register', 'Settings', 'My Orders'] },
          ].map(col => (
            <div key={col.title}>
              <h5 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>{col.title}</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => <li key={l}><Link to="/products" style={{ fontSize: 13, color: 'var(--text-muted)' }} className="link-hover">{l}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h5 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>Get app</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ icon: Apple, label: 'App Store', sub: 'Download on the' }, { icon: PlayCircle, label: 'Google Play', sub: 'GET IT ON' }].map(a => (
                <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1A1F2B', color: '#fff', borderRadius: 6, padding: '8px 14px', width: 'fit-content' }}>
                  <a.icon size={18} />
                  <div style={{ lineHeight: 1.1 }}>
                    <p style={{ fontSize: 9, margin: 0 }}>{a.sub}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{a.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', maxWidth: 1280, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--text-light)', margin: 0 }}>© 2024 Ecommerce.</p>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🇺🇸 English</span>
        </div>
      </div>
    </footer>
  );
}
