const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://classroom-backend-s22x.onrender.com";

export async function apiFetch(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
}
