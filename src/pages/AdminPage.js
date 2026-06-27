import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, ShoppingCart, LogOut, Check } from 'lucide-react';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EMPTY = { name:'', price:'', originalPrice:'', category:'Electronics', image:'', description:'', stock:'', featured:false, tag:'', colors:'', rating:'7.5', stars:'4', reviews:'0', sold:'0' };
const CATS = ['Mobile accessory','Electronics','Smartphones','Modern tech','Clothing'];

export default function AdminPage() {
  const { token, user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [delId, setDelId] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const fetch_ = () => { adminGetProducts(token).then(r => setProducts(r.data||[])).finally(() => setLoading(false)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetch_(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = p => {
    setForm({ name:p.name||'', price:p.price||'', originalPrice:p.originalPrice||'', category:p.category||'Electronics', image:p.image||'', description:p.description||'', stock:p.stock||'', featured:p.featured||false, tag:p.tag||'', colors:Array.isArray(p.colors)?p.colors.join(', '):'', rating:p.rating||'7.5', stars:p.stars||'4', reviews:p.reviews||'0', sold:p.sold||'0' });
    setEditId(p.id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.image) { showToast('⚠️ Name, price and image are required'); return; }
    setSaving(true);
    const data = { ...form, price:Number(form.price), originalPrice:form.originalPrice?Number(form.originalPrice):null, stock:Number(form.stock)||0, rating:Number(form.rating)||7.5, stars:Number(form.stars)||4, reviews:Number(form.reviews)||0, sold:Number(form.sold)||0, images:[form.image], colors:form.colors?form.colors.split(',').map(c=>c.trim()):[], supplier:{name:'Guanjoi Trading LLC',country:'Germany, Berlin',verified:true,worldwide:true}, moq:[{qty:'50-100 pcs',price:Number(form.price)}], specs:{}, features:[] };
    try {
      if (editId) { await adminUpdateProduct(token, editId, data); showToast('✅ Product updated!'); }
      else { await adminCreateProduct(token, data); showToast('✅ Product created!'); }
      setShowForm(false); fetch_();
    } catch { showToast('❌ Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => { await adminDeleteProduct(token, id); setDelId(null); showToast('🗑️ Product deleted'); fetch_(); };

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, background: '#1A1F2B', color: '#fff', padding: '12px 20px', borderRadius: 8, fontSize: 14, zIndex: 999 }}>{toast}</div>}

      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'var(--blue)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingCart size={16} color="#fff" /></div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>Admin Panel</span>
          <span style={{ fontSize: 12, background: '#EFF6FF', color: 'var(--blue)', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>{user?.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--blue)' }}>View Store</Link>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 14px', fontSize: 13, color: 'var(--text-muted)' }}><LogOut size={14} /> Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
          {[{ label:'Total Products', value:products.length, color:'var(--blue)' }, { label:'In Stock', value:products.filter(p=>p.stock>0).length, color:'var(--green)' }, { label:'Featured', value:products.filter(p=>p.featured).length, color:'var(--orange)' }, { label:'Out of Stock', value:products.filter(p=>p.stock===0).length, color:'var(--red)' }].map(s => (
            <div key={s.label} className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 6px' }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Products ({products.length})</h2>
            <button onClick={openAdd} className="btn-blue" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={15} /> Add Product</button>
          </div>
          {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Image','Name','Category','Price','Stock','Featured','Actions'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p,i) => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border)', background: i%2===0?'#fff':'#FAFAFA' }}>
                      <td style={{ padding: '12px 16px' }}><img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} onError={e => { e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80'; }} /></td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, maxWidth: 200 }}>
                        <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                        {p.tag && <span style={{ fontSize: 11, background: '#EFF6FF', color: 'var(--blue)', padding: '2px 6px', borderRadius: 4 }}>{p.tag}</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{p.category}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>${p.price}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 12, fontWeight: 600, color: p.stock>0?'var(--green)':'var(--red)', background: p.stock>0?'#F0FDF4':'#FEF2F2', padding: '3px 8px', borderRadius: 4 }}>{p.stock>0?p.stock:'Out'}</span></td>
                      <td style={{ padding: '12px 16px' }}>{p.featured && <Check size={16} color="var(--green)" />}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(p)} style={{ background: '#EFF6FF', border: 'none', borderRadius: 6, padding: '7px 10px', color: 'var(--blue)', display: 'flex', alignItems: 'center' }}><Pencil size={14} /></button>
                          <button onClick={() => setDelId(p.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: 6, padding: '7px 10px', color: 'var(--red)', display: 'flex', alignItems: 'center' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[{ label:'Product Name *', key:'name', full:true }, { label:'Price *', key:'price', type:'number' }, { label:'Original Price', key:'originalPrice', type:'number' }, { label:'Stock', key:'stock', type:'number' }, { label:'Tag (e.g. Sale)', key:'tag' }, { label:'Rating (0-10)', key:'rating', type:'number' }, { label:'Colors (comma separated)', key:'colors', full:true }, { label:'Image URL *', key:'image', full:true }].map(f => (
                <div key={f.key} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
                  <input type={f.type||'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none', background: '#fff' }}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="feat" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: 16, height: 16 }} />
                <label htmlFor="feat" style={{ fontSize: 14, fontWeight: 500 }}>Featured product</label>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-blue" style={{ flex: 1, opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}</button>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div className="card" style={{ padding: 28, maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, background: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Trash2 size={22} color="var(--red)" /></div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Delete Product?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDelId(null)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => handleDelete(delId)} style={{ flex: 1, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 14, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
