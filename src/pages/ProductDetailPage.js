import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageSquare, Heart, ShieldCheck, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProduct, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('Description');
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true); setError(''); setActiveImg(0);
    getProduct(slug)
      .then(res => {
        setProduct(res.data);
        return getProducts({ category: res.data.category, limit: 4 });
      })
      .then(res => setRelated((res.data || []).filter(p => p.slug !== slug).slice(0, 4)))
      .catch(() => setError('Product not found or backend not running.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addItem({ ...product, images: product.images?.length ? product.images : [product.image], size: product.sizes?.[0] || null, color: product.colors?.[0] || '', quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ background: '#F9FAFB', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="pdp-grid">
        {[0,1,2].map(i => <div key={i} className="card" style={{ height: 400, background: '#F3F4F6', animation: 'pulse 1.5s infinite' }} />)}
      </div>
    </div>
  );

  if (error || !product) return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <p style={{ fontSize: 18, color: 'var(--red)', marginBottom: 20 }}>{error || 'Product not found'}</p>
      <Link to="/products"><button className="btn-blue">Back to Shop</button></Link>
    </div>
  );

  const images = product.images?.length ? product.images : [product.image];
  const specs = product.specs || {};

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 20px 8px' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/" className="link-hover">Home</Link> &gt; <Link to="/products" className="link-hover">{product.category}</Link> &gt; <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </p>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 20px', display: 'grid', gridTemplateColumns: '400px 1fr 260px', gap: 20 }} className="pdp-grid">
        {/* Gallery */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ position: 'relative', paddingBottom: '100%', background: '#F9FAFB', borderRadius: 6, overflow: 'hidden', marginBottom: 12 }}>
            <img src={images[activeImg]} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80'; }} />
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i-1+images.length)%images.length)} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={16} /></button>
                <button onClick={() => setActiveImg(i => (i+1)%images.length)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={16} /></button>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {images.slice(0,5).map((img,i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{ flex: 1, aspectRatio: '1', borderRadius: 4, overflow: 'hidden', border: i===activeImg ? '2px solid var(--blue)' : '1px solid var(--border)', background: 'none', padding: 0 }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>✓ {product.stock > 0 ? 'In stock' : 'Out of stock'}</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 3 }}>{[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s<=(product.stars||0)?'var(--orange)':'none'} color="var(--orange)" />)}</div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{product.rating}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{product.reviews} reviews · {product.sold} sold</span>
          </div>

          {product.moq?.length > 0 && (
            <div style={{ display: 'flex', background: '#FFF8EB', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
              {product.moq.map((m,i) => (
                <div key={i} style={{ flex: 1, padding: '14px 16px', borderRight: i<product.moq.length-1 ? '1px solid #F3E3BF' : 'none' }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#DC8E0F', margin: '0 0 4px' }}>${m.price?.toFixed(2)}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{m.qty}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            {Object.entries(specs).slice(0,4).map(([k,v]) => (
              <div key={k} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 130, fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>

          {product.sizes?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Size</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map(s => <button key={s} style={{ padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, background: '#fff' }}>{s}</button>)}
              </div>
            </div>
          )}

          <button onClick={handleAdd} disabled={product.stock===0} className="btn-blue"
            style={{ width: '100%', padding: 13, fontSize: 14, background: added ? 'var(--green)' : product.stock===0 ? '#9CA3AF' : undefined }}>
            {added ? '✓ Added to Cart' : product.stock===0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {/* Supplier */}
        <div className="card" style={{ padding: 20, alignSelf: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, background: 'var(--blue)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>{(product.supplier?.name||'S')[0]}</div>
            <div><p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Supplier</p><p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{product.supplier?.name}</p></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>🇩🇪 {product.supplier?.country}</div>
            {product.supplier?.verified && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><ShieldCheck size={14} color="var(--green)" /> Verified Seller</div>}
            {product.supplier?.worldwide && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><Globe size={14} /> Worldwide shipping</div>}
          </div>
          <button className="btn-blue" style={{ width: '100%', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><MessageSquare size={15} /> Send inquiry</button>
          <button className="btn-outline" style={{ width: '100%', marginBottom: 14 }}>Seller's profile</button>
          <button onClick={() => setWished(v=>!v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', fontSize: 13, color: wished?'var(--red)':'var(--blue)', padding: 0 }}>
            <Heart size={15} fill={wished?'var(--red)':'none'} /> Save for later
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '8px 20px 40px', display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }} className="pdp-tabs-grid">
        <div className="card" style={{ padding: 0 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 20px' }}>
            {['Description','Reviews','Shipping','About seller'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', padding: '16px 0', marginRight: 28, fontSize: 14, fontWeight: 600, color: tab===t?'var(--blue)':'var(--text-muted)', borderBottom: tab===t?'2px solid var(--blue)':'2px solid transparent' }}>{t}</button>
            ))}
          </div>
          <div style={{ padding: 24 }}>
            {tab==='Description' && (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 20 }}>{product.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                  <div>{Object.entries(specs).map(([k,v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}><span style={{ color: 'var(--text-muted)' }}>{k}</span><span>{v}</span></div>)}</div>
                  <div>{product.features?.map((f,i) => <p key={i} style={{ fontSize: 13.5, margin: '0 0 10px' }}>✓ {f}</p>)}</div>
                </div>
              </>
            )}
            {tab==='Reviews' && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{product.reviews} reviews · {product.rating} average rating</p>}
            {tab==='Shipping' && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Worldwide shipping available. Lead time depends on order quantity.</p>}
            {tab==='About seller' && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{product.supplier?.name} — Verified supplier based in {product.supplier?.country}.</p>}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>You may also like</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {related.map(p => (
              <Link key={p.id} to={`/products/${p.slug}`} className="card card-hover" style={{ display: 'flex', gap: 10, padding: 10, alignItems: 'center' }}>
                <img src={p.image||p.images?.[0]} alt={p.name} style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} onError={e => { e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80'; }} />
                <div><p style={{ fontSize: 12.5, margin: '0 0 4px', lineHeight: 1.3 }}>{p.name}</p><p style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 700, margin: 0 }}>${p.price?.toFixed(2)}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 60px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Related products</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 1000px) { .pdp-grid { grid-template-columns: 1fr !important; } .pdp-tabs-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
