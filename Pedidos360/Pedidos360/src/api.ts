import { obtenerToken } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

async function authorizedFetch(instance, account, path = '') {
  if (!BASE_URL) {
    throw new Error('Complete VITE_API_BASE_URL y reinicie Vite');
  }

  const token = await obtenerToken(instance, account);

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

export async function getOrders(instance, account, params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = query ? `?${query}` : '';
  return authorizedFetch(instance, account, path);
}

export async function getOrderById(instance, account, id) {
  return authorizedFetch(instance, account, `/${id}`);
}