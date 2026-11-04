
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../redux/slices/authSlice";
import ErrorMessage from "../components/common/ErrorMessage";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  }

  if (isAuthenticated) {
    return <div className="page-container">You are already logged in.</div>;
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p>Login to explore Sacred Heritage.</p>

        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
