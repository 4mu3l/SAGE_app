const BASE_URL = 'https://sage-app.onrender.com';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensagem =
      typeof data === 'string'
        ? data
        : data?.detail
          ? JSON.stringify(data.detail)
          : data?.message
            ? data.message
            : JSON.stringify(data);

    throw new Error(mensagem);
  }

  return data;
}