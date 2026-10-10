import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await authService.login(
        email,
        password
      );

      console.log("Login response:", response);

setMessage("Login successful");

if (response.role === "STUDENT") {
  navigate("/student/dashboard");
} else if (response.role === "FACULTY") {
  navigate("/faculty/dashboard");
} else if (response.role === "ADMIN") {
  navigate("/admin/dashboard");
}
    } catch (error) {
      console.error("Login error:", error);

      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <h1>SCMS Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <br />

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">
            Password
          </label>

          <br />

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <br />

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}
    </div>
  );
}

export default Login;