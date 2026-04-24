const API_URL = import.meta.env.VITE_API_URL;

export function getAccessToken() {
  return localStorage.getItem('admin_access_token');
}

export function setAccessToken(token: string) {
  localStorage.setItem('admin_access_token', token);
}

export function removeAccessToken() {
  localStorage.removeItem('admin_access_token');
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Ошибка сервера.');
  }

  return data as T;
}