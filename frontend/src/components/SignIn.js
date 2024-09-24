import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/signin/`, {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      // Save the JWT tokens and user data in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userData", JSON.stringify(user));

      // Set the default Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // You can also update your application state here if you're using Redux or Context API
      // For example: dispatch(setUser(user));

      navigate("/myworkboards");
    } catch (error) {
      setError(
        error.response?.data?.detail || "An error occurred during sign in."
      );
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">WorkBoards</h2>
        <h3 className="text-2xl font-bold text-center mb-4">Sign In</h3>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-2 mb-4 border border-gray-200 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 mb-4 border border-gray-200 rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Log In
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
        <p className="text-center mt-2">
          Back to{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Home
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
