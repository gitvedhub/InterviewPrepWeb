import React, { useState, useContext } from "react";
import Input from "../../components/Cards/inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const Login = ({ setCurrentPage, onCloseModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        // ✅ Store token in localStorage to persist session
        localStorage.setItem("token", token);

        // Optionally update user context
        updateUser(token);

        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-md bg-white rounded-xl border border-amber-400 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Login</h2>
      <p className="text-sm text-gray-500 mb-4">
        Welcome back! Please login to your account.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-full mt-4 transition font-semibold disabled:opacity-60"
        >
          {loading ? "Logging In..." : "LOGIN"}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Don’t have an account?{" "}
        <button
          onClick={() => setCurrentPage("signup")}
          className="text-amber-600 font-medium hover:underline"
        >
          Sign Up
        </button>
      </p>

      <button
        onClick={onCloseModal}
        className="mt-6 text-sm text-gray-400 hover:text-gray-700 block mx-auto"
      >
        ✕ Close
      </button>
    </div>
  );
};

export default Login;
