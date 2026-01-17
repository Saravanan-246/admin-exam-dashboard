const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://classroom-backend-s22x.onrender.com/api";

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

  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || "API error");
  }

  return data;
};
