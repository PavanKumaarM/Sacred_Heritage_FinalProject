
import api from "./api";

const register = async (userData) => {
  return api.post("/auth/signup", userData);
};

const login = async (credentials) => {
  return api.post("/auth/login", credentials);
};

const getProfile = async () => {
  return api.get("/users/me");
};

const updateProfile = async (profileData) => {
  return api.patch("/users/me", profileData);
};

const authService = {
  register,
  login,
  getProfile,
  updateProfile,
};

export default authService;
