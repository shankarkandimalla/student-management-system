import axiosInstance from "../api/axiosInstance";

const login = async (email, password) => {
  const response = await axiosInstance.post(
    "/api/auth/login",
    {
      email: email,
      password: password,
    }
  );

  const user = response.data;

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  return user;
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (user === null) {
    return null;
  }

  return JSON.parse(user);
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  login: login,
  getCurrentUser: getCurrentUser,
  logout: logout,
};

export default authService;