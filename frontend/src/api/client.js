const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mussa-production-8310.up.railway.app";
async function apiFetch(path, options) {
  const url =
    /^https?:\/\//i.test(path)
      ? path
      : `${API_BASE_URL}${path}`

  return fetch(url, options)
}

export { API_BASE_URL, apiFetch }