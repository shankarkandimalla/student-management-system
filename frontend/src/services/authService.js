
import axiosInstance from "../api/axiosInstance";


const register = async (email, password, role) => {
  const response = await axiosInstance.post(
    "/api/auth/register",
    {
      email: email.trim().toLowerCase(),
      password: password,
      role: role,
    }
  );

  return response.data;
};


const login = async (email, password) => {
  const response = await axiosInstance.post(
    "/api/auth/login",
    {
      email: email.trim().toLowerCase(),
      password: password,
    }
  );

  const user = response.data;

  localStorage.setItem("user", JSON.stringify(user));

  if (user.token) {
    localStorage.setItem("token", user.token);
  }

  return user;
};

const getCurrentUser = () => {
  const storedUser = localStorage.getItem("user");

  if (storedUser === null) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const authService = {
  register: register,
  login: login,
  getCurrentUser: getCurrentUser,
  logout: logout,
};

export default authService;
