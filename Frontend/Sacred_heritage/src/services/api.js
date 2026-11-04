const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function request(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const headers = {};

  if (body !== null) {
    headers["Content-Type"] = "application/json";
  }

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

  const response = await fetch(
    `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
    options
  );

  const responseText = await response.text();

  let data = {};

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        message: responseText,
      };
    }
  }

 if (!response.ok) {
  const error = new Error(
    data.message || `Request failed with status ${response.status}`
  );

  error.status = response.status;

  throw error;
}

  return data;
}

const api = {
  get: (endpoint) => request(endpoint),

  post: (endpoint, body) => request(endpoint, "POST", body),

  patch: (endpoint, body) => request(endpoint, "PATCH", body),

  put: (endpoint, body) => request(endpoint, "PUT", body),

  delete: (endpoint) => request(endpoint, "DELETE"),
};

export default api;
