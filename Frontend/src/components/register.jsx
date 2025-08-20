import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { FaPiggyBank } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

const Register = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ userData, setUserData ] = useState({})


  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/register`,
      newUser
    );

    if (response.status === 201) {
      const data = response.data;
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/dashboard");
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4 relative">
      <header className="w-full absolute top-0 left-0 p-4 bg-blue-600 text-white shadow-md flex items-center justify-between px-6">
  {/* Left: Home Icon */}
  <Link to="/home" className="text-white text-xl md:text-2xl hover:text-gray-200 transition z-10">
    <FaHome />
  </Link>

  {/* Center: Title */}
  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
    <FaPiggyBank className="text-xl md:text-2xl" />
    <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
      Personal Finance Tracker
    </h1>
  </div>
</header><div className="w-full absolute top-0 left-0 p-4 text-center bg-blue-600 text-white shadow-md flex justify-center items-center gap-2">
        <FaPiggyBank className="text-xl md:text-2xl" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          personal Finance Tracker
        </h1>
      </div>

      <div className="bg-white/30 backdrop-blur-lg shadow-2xl border border-white/30 rounded-2xl p-8 w-full max-w-md mt-24">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Account
        </h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              First Name
            </label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Last Name
            </label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Email
            </label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Create password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition transform hover:scale-105 duration-200"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <button className="text-blue-500 hover:underline">
            <Link to={"/login"}>Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
