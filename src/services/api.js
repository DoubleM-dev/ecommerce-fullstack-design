const BASE_URL = 'http://localhost:5000/api';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getProducts({ search = '', category = '', featured = false, sort = '', limit = 20, page = 1 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (featured) params.append('featured', 'true');
  if (sort) params.append('sort', sort);
  params.append('limit', limit);
  params.append('page', page);
  return request(`/products?${params.toString()}`);
}

export async function getProduct(idOrSlug) {
  return request(`/products/${idOrSlug}`);
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function adminGetProducts(token) {
  const res = await fetch(`${BASE_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

export async function adminCreateProduct(token, data) {
  const res = await fetch(`${BASE_URL}/admin/products`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdateProduct(token, id, data) {
  const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteProduct(token, id) {
  const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
