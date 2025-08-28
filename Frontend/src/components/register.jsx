import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { FaPiggyBank, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const { setUser } = useContext(UserDataContext);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4 relative overflow-hidden">
      {/* Animated floating bubbles in background */}
      <motion.div
        className="absolute w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{ x: [0, -60, 60, 0], y: [0, 40, -40, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      {/* Header */}
      <header className="w-full absolute top-0 left-0 p-4 bg-blue-600 text-white shadow-md flex items-center justify-between px-6 z-10">
        <Link
          to="/home"
          className="text-white text-xl md:text-2xl hover:text-gray-200 transition"
        >
          <FaHome />
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <FaPiggyBank className="text-xl md:text-2xl" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Personal Finance Tracker
          </h1>
        </div>
      </header>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/30 backdrop-blur-lg shadow-2xl border border-white/30 rounded-2xl p-8 w-full max-w-md mt-24 relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center text-blue-600 mb-6"
        >
          Create Account
        </motion.h2>

        <form onSubmit={submitHandler} className="space-y-5">
          {[
            { label: "First Name", value: firstName, setter: setFirstName },
            { label: "Last Name", value: lastName, setter: setLastName },
            { label: "Email", value: email, setter: setEmail, type: "email" },
            {
              label: "Password",
              value: password,
              setter: setPassword,
              type: "password",
            },
          ].map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.2 }}
            >
              <label className="block mb-1 text-gray-700 font-medium">
                {field.label}
              </label>
              <input
                required
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                type={field.type || "text"}
                placeholder={`Enter ${field.label}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Register
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 text-sm text-center text-gray-600"
        >
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-500 hover:underline">
            Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
