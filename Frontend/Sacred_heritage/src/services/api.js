
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:7000/api";

async function request(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

const api = {
  get: (endpoint) => request(endpoint),

  post: (endpoint, body) =>
    request(endpoint, "POST", body),

  patch: (endpoint, body) =>
    request(endpoint, "PATCH", body),

  delete: (endpoint) =>
    request(endpoint, "DELETE"),
};

export default api;
