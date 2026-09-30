import { cache } from 'react';
import { cookies, headers } from 'next/headers';

const API_URL =
  process.env.API_URL ??
  'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';

/**
 * Server-side fetch helper. Forwards the incoming request's Host and Cookie
 * headers to the nginx ingress so the backend services can route and
 * authenticate the request (JWT inside the cookie-session `session` cookie).
 *
 * Never throws: returns `fallback` when the API is unreachable or responds
 * with an error, so pages can still render (e.g. during `next build`).
 */
export async function apiFetch (path, fallback = null) {
  try {
    const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);

    const requestHeaders = {};
    const host = headerStore.get('host');
    if (host) {
      requestHeaders.Host = host;
    }
    const cookie = cookieStore.toString();
    if (cookie) {
      requestHeaders.Cookie = cookie;
    }

    const response = await fetch(`${API_URL}${path}`, {
      cache: 'no-store',
      headers: requestHeaders
    });

    if (!response.ok) {
      return fallback;
    }

    return await response.json();
  } catch (err) {
    return fallback;
  }
}

// Deduped across the layout and pages within a single request
export const getCurrentUser = cache(async () => {
  const data = await apiFetch('/api/users/currentuser');
  return data?.currentUser ?? null;
});

export async function getProducts () {
  return (await apiFetch('/api/products', [])) ?? [];
}

export async function getProduct (productId) {
  return await apiFetch(`/api/products/${productId}`);
}

export async function getBestseller () {
  return (await apiFetch('/api/products/bestseller', [])) ?? [];
}

export async function getUsers () {
  return (await apiFetch('/api/users', [])) ?? [];
}

export async function getOrders () {
  return (await apiFetch('/api/orders', [])) ?? [];
}

export async function getOrder (orderId) {
  return await apiFetch(`/api/orders/${orderId}`);
}

export async function getMyOrders () {
  return (await apiFetch('/api/orders/myorders', [])) ?? [];
}

export async function getMyReviews () {
  return (await apiFetch('/api/products/myreviews', [])) ?? [];
}

export async function getOrderProducts () {
  return (await apiFetch('/api/orders/products', [])) ?? [];
}

export async function getPaymentProducts () {
  return (await apiFetch('/api/payments/products', [])) ?? [];
}
