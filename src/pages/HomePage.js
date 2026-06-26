import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Watch, Laptop, Headphones, Briefcase, Sofa } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

function useCountdown() {
  const [t, setT] = useState({ h: 13, m: 34, s: 56 });
  useEffect(() => {
    const timer = setInterval(() => setT(p => {
      let { h, m, s } = p; s--; if (s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=m=s=0;}
      return { h, m, s };
    }), 1000);
    return () => clearInterval(timer);
  }, []);
  return t;
}

export default function HomePage() {
  const { h, m, s } = useCountdown();
  const pad = n => String(n).padStart(2, '0');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: true, limit: 8 })
      .then(r => setFeatured(r.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const deals = [
    { name: 'Smart watches', d: '-25%', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=100&q=80' },
    { name: 'Smart watches', d: '-25%', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
    { name: 'Smart watches', d: '-25%', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&q=80' },
  ];
  const outdoor = [
    { name: 'Smart watches', price: 'From USD 19', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80' },
    { name: 'Smart watches', price: 'From USD 19', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&q=80' },
    { name: 'Smart watches', price: 'From USD 19', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&q=80' },
  ];
  const electronics = [
    'https://images.unsplash.com/photo-1592286927505-1def25115558?w=300&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=300&q=80',
  ];
  const catIcons = [{ icon: Smartphone, name: 'Phones' }, { icon: Watch, name: 'Watches' }, { icon: Laptop, name: 'Laptops' }, { icon: Headphones, name: 'Audio' }, { icon: Briefcase, name: 'Bags' }, { icon: Sofa, name: 'Furniture' }];

  return (
    <div style={{ background: '#F9FAFB', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 20px 0', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', gap: 28, overflowX: 'auto', paddingBottom: 16, marginBottom: 8, maxWidth: '100%' }}>
          {catIcons.map(c => (
            <Link key={c.name} to="/products" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}><c.icon size={22} strokeWidth={1.5} /></div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.name}</span>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }} className="hero-grid">
          <div style={{ background: 'linear-gradient(135deg,#0D2436,#16344A)', borderRadius: 10, padding: '44px 36px', position: 'relative', overflow: 'hidden', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#7FE0C9', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Latest trending</span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, margin: '0 0 20px', lineHeight: 1.15 }}>Electronic items</h1>
            <Link to="/products"><button className="btn-blue" style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: 8 }}>Learn more <ArrowRight size={14} /></button></Link>
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" alt="" style={{ position: 'absolute', right: -20, bottom: -20, width: 240, opacity: 0.9, objectFit: 'contain' }} className="hero-img-deco" />
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Deals and offers</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 16px' }}>Electronic equipments</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ v: h, l: 'Hours' }, { v: m, l: 'Min' }, { v: s, l: 'Sec' }].map((t, i) => (
                <div key={i} style={{ flex: 1, background: '#1A1F2B', color: '#fff', borderRadius: 6, padding: '8px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'monospace' }}>{pad(t.v)}</p>
                  <p style={{ fontSize: 9, margin: 0, opacity: 0.7 }}>{t.l}</p>
                </div>
              ))}
            </div>
            {deals.map((d, i) => (
              <Link key={i} to="/products" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < deals.length-1 ? 14 : 0 }}>
                <img src={d.img} alt={d.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}><p style={{ fontSize: 13, margin: 0 }}>{d.name}</p></div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>{d.d}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Home and outdoor</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="outdoor-grid">
            {outdoor.map((d, i) => (
              <Link key={i} to="/products" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <img src={d.img} alt={d.name} style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</p>
                  <p style={{ fontSize: 12, margin: 0, color: 'var(--blue)', fontWeight: 600, whiteSpace: 'nowrap' }}>{d.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, fontSize: 13, fontWeight: 600, color: 'var(--blue)' }}>Source now <ArrowRight size={13} /></Link>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Consumer electronics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14 }} className="electronics-grid">
            {electronics.map((img, i) => (
              <Link key={i} to="/products" style={{ aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: '#F3F4F6', display: 'block' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px' }}>Featured products</h2>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="card" style={{ height: 280, background: '#F3F4F6', animation: 'pulse 1.5s infinite' }} />)}
            </div>
          ) : featured.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No featured products. Run: <code>npm run seed</code> in backend folder.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr !important; } .electronics-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 600px) { .hero-img-deco { display: none; } }
        @media (max-width: 480px) { .outdoor-grid { grid-template-columns: 1fr !important; gap: 14px !important; } }
        @media (max-width: 360px) { .electronics-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}
