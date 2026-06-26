import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Grid3x3, List, X, Search } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATS = ['Mobile accessory','Electronics','Smartphones','Modern tech','Clothing'];
const BRANDS = ['Samsung','Apple','Huawei','Pocco','Lenovo'];
const FEATURES = ['Metallic','Plastic cover','8GB Ram','Super power','Large Memory'];

function Section({ title, children, open: def = true }) {
  const [open, setOpen] = useState(def);
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 18, marginBottom: 18 }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: 0, marginBottom: open ? 14 : 0 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
        {open ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
      </button>
      {open && children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="card">
      <div style={{ paddingBottom: '90%', background: '#F3F4F6', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: 14 }}>
        <div style={{ height: 14, background: '#F3F4F6', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: 12, background: '#F3F4F6', borderRadius: 4, width: '60%', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  );
}

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || '';
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedBrands, setSelectedBrands] = useState(['Samsung','Apple','Pocco']);
  const [selectedFeatures, setSelectedFeatures] = useState(['Metallic']);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('');
  const [priceMax, setPriceMax] = useState(1200);
  const [page, setPage] = useState(1);

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const fetchProducts = useCallback(() => {
    setLoading(true); setError('');
    getProducts({ search, category: catParam, sort: sortBy, limit: 12, page })
      .then(r => { setProducts(r.data || []); setTotal(r.total || 0); })
      .catch(() => setError('Cannot connect to backend. Run: cd backend && npm run dev'))
      .finally(() => setLoading(false));
  }, [search, catParam, sortBy, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeFilters = [...selectedBrands.map(b => ({ type: 'brand', label: b })), ...selectedFeatures.map(f => ({ type: 'feature', label: f }))];
  const clearFilter = f => {
    if (f.type === 'brand') setSelectedBrands(p => p.filter(x => x !== f.label));
    if (f.type === 'feature') setSelectedFeatures(p => p.filter(x => x !== f.label));
  };
  const totalPages = Math.ceil(total / 12);

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 20px 16px' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          <Link to="/" className="link-hover">Home</Link> &gt; <span style={{ color: 'var(--text)' }}>{catParam || 'All products'}</span>
        </p>
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }} style={{ display: 'flex', gap: 10, marginBottom: 20, maxWidth: 520 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '0 14px', gap: 8 }}>
            <Search size={15} color="var(--text-light)" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search by name or category..." style={{ flex: 1, border: 'none', padding: '10px 0', fontSize: 14, outline: 'none' }} />
          </div>
          <button type="submit" className="btn-blue">Search</button>
          {search && <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="btn-outline" style={{ padding: '10px 14px' }}><X size={14} /></button>}
        </form>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }} className="listing-layout">
        <aside className="card listing-sidebar" style={{ padding: 20, alignSelf: 'start' }}>
          <Section title="Category">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <Link to="/products" style={{ fontSize: 13.5, color: !catParam ? 'var(--blue)' : 'var(--text-muted)', fontWeight: !catParam ? 600 : 400 }}>All products</Link>
              {CATS.map(c => <Link key={c} to={`/products?cat=${encodeURIComponent(c)}`} style={{ fontSize: 13.5, color: catParam===c ? 'var(--blue)' : 'var(--text-muted)', fontWeight: catParam===c ? 600 : 400 }}>{c}</Link>)}
            </div>
          </Section>
          <Section title="Brands">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {BRANDS.map(b => <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}><input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggle(selectedBrands, setSelectedBrands, b)} />{b}</label>)}
            </div>
          </Section>
          <Section title="Features">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {FEATURES.map(f => <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}><input type="checkbox" checked={selectedFeatures.includes(f)} onChange={() => toggle(selectedFeatures, setSelectedFeatures, f)} />{f}</label>)}
            </div>
          </Section>
          <Section title="Price range">
            <input type="range" min={0} max={1200} step={10} value={priceMax} onChange={e => setPriceMax(+e.target.value)} style={{ width: '100%', accentColor: 'var(--blue)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}><span>$0</span><span>Up to ${priceMax}</span></div>
          </Section>
          <Section title="Condition" open={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {['New','Used','Refurbished'].map(c => <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}><input type="checkbox" />{c}</label>)}
            </div>
          </Section>
        </aside>

        <div>
          <div className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 14 }}><strong>{total}</strong> items {catParam ? `in ${catParam}` : ''} {search ? `for "${search}"` : ''}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} style={{ appearance: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 28px 7px 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                  <option value="">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                  <option value="sold">Best Selling</option>
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-light)' }} />
              </div>
              <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => setView('grid')} style={{ background: view==='grid' ? 'var(--blue)' : '#fff', color: view==='grid' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '7px 10px', display: 'flex' }}><Grid3x3 size={15} /></button>
                <button onClick={() => setView('list')} style={{ background: view==='list' ? 'var(--blue)' : '#fff', color: view==='list' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '7px 10px', display: 'flex' }}><List size={15} /></button>
              </div>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              {activeFilters.map((f, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 10px 5px 12px', fontSize: 12.5 }}>{f.label} <button onClick={() => clearFilter(f)} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', color: 'var(--text-light)' }}><X size={13} /></button></span>)}
              <button onClick={() => { setSelectedBrands([]); setSelectedFeatures([]); }} style={{ background: 'none', border: 'none', fontSize: 12.5, color: 'var(--blue)', padding: 0 }}>Clear all filter</button>
            </div>
          )}

          {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '16px 20px', marginBottom: 16, color: 'var(--red)', fontSize: 14 }}>⚠️ {error}</div>}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <p style={{ fontSize: 18, color: 'var(--text-muted)' }}>No products found</p>
              <Link to="/products"><button className="btn-outline" style={{ marginTop: 16 }}>Clear filters</button></Link>
            </div>
          ) : view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {products.map(p => <div key={p.id} className="fade-in"><ProductCard product={p} /></div>)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {products.map(p => <div key={p.id} className="fade-in"><ProductCard product={p} listView /></div>)}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 36 }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', opacity: page===1 ? 0.5 : 1 }}>‹</button>
              {[...Array(totalPages)].map((_,i) => <button key={i} onClick={() => setPage(i+1)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: page===i+1 ? 'var(--blue)' : '#fff', color: page===i+1 ? '#fff' : 'var(--text)', fontSize: 13, fontWeight: 600 }}>{i+1}</button>)}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: '#fff', opacity: page===totalPages ? 0.5 : 1 }}>›</button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) { .listing-layout { grid-template-columns: 1fr !important; } .listing-sidebar { display: none; } }
      `}</style>
    </div>
  );
}
