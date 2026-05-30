import { useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  saveToken,
} from "../utils/auth";

import { saveUser } from "../utils/user";

function Login() {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          formData
        );

      saveToken(
        res.data.token
      );

      saveUser(res.data.user);

      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>
          Welcome Back
        </h1>

        <p className="subtitle">
          Login to continue
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="form-group">
            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={
                handleChange
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={
                handleChange
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {message && (
          <p className="error-msg">
            {message}
          </p>
        )}

        <p className="bottom-text">
          Don’t have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;