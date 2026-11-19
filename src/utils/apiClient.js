// src/utils/apiClient.js
  export const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:4000');

async function request(path, options = {}) {
  // Is the body a FormData (file upload)? Then the browser must send it as-is.
  const isForm = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      // For FormData we must NOT set Content-Type: the browser adds
      // "multipart/form-data; boundary=..." itself, and the boundary is required.
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    credentials: 'include',
    body: options.body ? (isForm ? options.body : JSON.stringify(options.body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};