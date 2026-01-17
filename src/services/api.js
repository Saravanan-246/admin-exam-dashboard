const API_BASE = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE) {
  console.error("❌ VITE_API_BASE_URL is missing in .env");
}

export const apiFetch = async (url, options = {}) => {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("studentToken");

  const res = await fetch(`${API_BASE}${url}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    body: options.body,
  });

  // ✅ SAFE ERROR HANDLING
  if (!res.ok) {
    let message = "API error";
    try {
      const error = await res.json();
      message = error.message || message;
    } catch {
      // backend may not return JSON
    }
    throw new Error(message);
  }

  return res.json();
};
