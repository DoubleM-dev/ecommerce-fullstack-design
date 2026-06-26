import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

export default function ProductCard({ product, listView = false }) {
  const [wished, setWished] = useState(false);
  const img = product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80';
  const linkTo = `/products/${product.slug || product.id}`;

  if (listView) {
    return (
      <Link to={linkTo}>
        <div className="card card-hover" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center' }}>
          <div style={{ width: 100, height: 100, flexShrink: 0, background: '#F3F4F6', borderRadius: 6, overflow: 'hidden' }}>
            <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80'; }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 6px' }}>{product.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= (product.stars||0) ? 'var(--orange)' : 'none'} color="var(--orange)" />)}
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{product.rating} · {product.sold} sold</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--green)' }}>Free Shipping</span>
          </div>
          <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>${product.price?.toFixed(2)}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="card card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
      <Link to={linkTo}>
        <div style={{ position: 'relative', paddingBottom: '90%', background: '#F3F4F6', overflow: 'hidden' }}>
          <img src={img} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80'; }} />
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>SOLD OUT</span>
            </div>
          )}
        </div>
      </Link>
      <button onClick={e => { e.preventDefault(); setWished(v => !v); }} style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: wished ? 'var(--red)' : 'var(--text-light)' }}>
        <Heart size={14} fill={wished ? 'var(--red)' : 'none'} />
      </button>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>${product.price?.toFixed(2)}</span>
          {product.originalPrice && <span style={{ fontSize: 13, color: 'var(--text-light)', textDecoration: 'line-through' }}>${product.originalPrice?.toFixed(2)}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= (product.stars||0) ? 'var(--orange)' : 'none'} color="var(--orange)" />)}
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>{product.rating}</span>
        </div>
        <Link to={linkTo}><p style={{ fontSize: 13.5, color: 'var(--text)', margin: 0, lineHeight: 1.4 }} className="link-hover">{product.name}</p></Link>
      </div>
    </div>
  );
}
