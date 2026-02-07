type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const req = async (method: Method, path: string, body?: unknown, headers: Record<string, string> = {}, retry = true) => {
  const res = await fetch(`${baseURL}${path}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401 && retry) {
    const refresh = await fetch(`${baseURL}/auth/refresh`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
    if (refresh.ok) {
      const data = await refresh.json();
      localStorage.setItem('auth_token', data.accessToken);
      return req(method, path, body, { ...headers, Authorization: `Bearer ${data.accessToken}` }, false);
    }
  }

  if (!res.ok) throw new Error(await res.text());
  return { data: await res.json() };
};

export const api = {
  get: (path: string, opts?: { headers?: Record<string, string> }) => req('GET', path, undefined, opts?.headers),
  post: (path: string, body?: unknown, opts?: { headers?: Record<string, string> }) => req('POST', path, body, opts?.headers),
  patch: (path: string, body?: unknown, opts?: { headers?: Record<string, string> }) => req('PATCH', path, body, opts?.headers),
  put: (path: string, body?: unknown, opts?: { headers?: Record<string, string> }) => req('PUT', path, body, opts?.headers),
  delete: (path: string, opts?: { headers?: Record<string, string> }) => req('DELETE', path, undefined, opts?.headers)
};
