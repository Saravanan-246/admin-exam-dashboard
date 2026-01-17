const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  throw new Error("❌ VITE_API_BASE_URL is not defined");
}

export const apiFetch = async (url, options = {}) => {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("studentToken");

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || "API error");
  }

  return data;
};
