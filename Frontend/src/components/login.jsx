import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { FaPiggyBank } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/login`,
      userData
    );

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    }

    setemail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4 relative">
<header className="w-full absolute top-0 left-0 p-4 bg-blue-600 text-white shadow-md flex items-center justify-between px-6">
  <Link to="/home" className="text-white text-xl md:text-2xl hover:text-gray-200 transition">
    <FaHome />
  </Link>
  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
    <FaPiggyBank className="text-xl md:text-2xl" />
    <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
      Personal Finance Tracker
    </h1>
  </div>
</header>

      <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-md mt-20">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <button className="text-blue-500 hover:underline">
            <Link to={"/register"}>Sign Up</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
