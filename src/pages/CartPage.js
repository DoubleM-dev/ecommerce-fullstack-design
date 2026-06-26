import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MessageSquare, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total, count, addItem } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [discount] = useState(60.00);
  const [saved, setSaved] = useState([]);
  const tax = 14.00;
  const grand = total - discount + tax;

  React.useEffect(() => {
    getProducts({ limit: 4 }).then(r => setSaved(r.data || [])).catch(() => {});
  }, []);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SHOP10') setCouponMsg('✅ Coupon applied — 10% off!');
    else setCouponMsg('❌ Invalid code. Try SHOP10');
  };

  if (items.length === 0) return (
    <div style={{ background: '#F9FAFB', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <ShoppingCart size={28} color="var(--text-light)" />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Your cart is empty</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 24px' }}>Add some items to get started.</p>
      <Link to="/products"><button className="btn-blue">Back to shop</button></Link>
    </div>
  );

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 60px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 20px' }}>My cart ({count})</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }} className="cart-grid">
          <div className="card" style={{ padding: 20 }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: idx<items.length-1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Link to={`/products/${item.slug||item.id}`}>
                  <img src={item.image||item.images?.[0]} alt={item.name} style={{ width: 64, height: 64, borderRadius: 6, objectFit: 'cover', background: '#F3F4F6' }} onError={e => { e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&q=80'; }} />
                </Link>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 6px' }}>{item.name}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 4px' }}>Size: {item.size||'N/A'} · Color: {item.color||'N/A'}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 10px' }}>Seller: {item.supplier?.name||'Artel Market'}</p>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: 'var(--red)' }}>Remove</button>
                    <button style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: 'var(--blue)' }}>Save for later</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>${(item.price*item.quantity).toFixed(2)}</p>
                  <select value={item.quantity} onChange={e => updateQty(idx, +e.target.value)} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', fontSize: 13 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                  </select>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: 'var(--blue)' }}><ArrowLeft size={15} /> Back to shop</Link>
              <button onClick={clearCart} style={{ background: 'none', border: 'none', fontSize: 13.5, color: 'var(--red)' }}>Remove all</button>
            </div>
          </div>

          <div>
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>Have a coupon?</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: couponMsg ? 8 : 0 }}>
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Add coupon" style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 6, padding: '9px 12px', fontSize: 13, outline: 'none' }} />
                <button onClick={applyCoupon} className="btn-outline" style={{ padding: '9px 16px' }}>Apply</button>
              </div>
              {couponMsg && <p style={{ fontSize: 12, color: couponMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)', margin: 0 }}>{couponMsg}</p>}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ color: 'var(--text-muted)' }}>Discount</span><span style={{ color: 'var(--red)', fontWeight: 600 }}>-${discount.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ color: 'var(--text-muted)' }}>Tax</span><span style={{ color: 'var(--green)', fontWeight: 600 }}>+${tax.toFixed(2)}</span></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)', marginBottom: 18 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 19 }}>${grand.toFixed(2)}</span>
              </div>
              <button className="btn-green" style={{ width: '100%' }}>Checkout</button>
              <p style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center', marginTop: 12 }}>💳 Secure checkout · SSL encrypted</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 24 }} className="trust-strip">
          {[{ icon: ShieldCheck, t: 'Secure payment', d: 'Have you ever finally just' }, { icon: MessageSquare, t: 'Customer support', d: 'Have you ever finally just' }, { icon: Truck, t: 'Free delivery', d: 'Have you ever finally just' }].map(x => (
            <div key={x.t} className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><x.icon size={17} color="var(--text-muted)" /></div>
              <div><p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{x.t}</p><p style={{ fontSize: 11.5, color: 'var(--text-light)', margin: 0 }}>{x.d}</p></div>
            </div>
          ))}
        </div>

        {saved.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Saved for later</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
              {saved.map(p => (
                <div key={p.id} className="card" style={{ padding: 14 }}>
                  <Link to={`/products/${p.slug}`}>
                    <div style={{ paddingBottom: '90%', position: 'relative', background: '#F3F4F6', borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
                      <img src={p.image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80'; }} />
                    </div>
                  </Link>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>${p.price?.toFixed(2)}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.3 }}>{p.name}</p>
                  <button onClick={() => addItem({ ...p, size: p.sizes?.[0]||null, color: p.colors?.[0]||'', quantity: 1 })} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, fontSize: 12.5, color: 'var(--blue)', fontWeight: 600 }}>
                    <ShoppingCart size={13} /> Move to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) { .cart-grid { grid-template-columns: 1fr !important; } .trust-strip { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
