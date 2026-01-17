const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || "API error");
  }

  return data;
};
