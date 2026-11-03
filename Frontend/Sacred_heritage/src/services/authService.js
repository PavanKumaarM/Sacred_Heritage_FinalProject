
import api from "./api";

const register = async (userData) => {
  return await api.post("/auth/signup", userData);
};

const login = async (credentials) => {
  return await api.post("/auth/login", credentials);
};

const getProfile = async () => {
  return await api.get("/users/me");
};

const updateProfile = async (profileData) => {
  return await api.patch("/users/me", profileData);
};

const authService = {
  register,
  login,
  getProfile,
  updateProfile,
};

export default authService;
