import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHome, FaPiggyBank } from "react-icons/fa";
import { UserDataContext } from "../context/UserContext";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType("error");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verify-otp`,
        { email, otp }
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to verify OTP");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    setMessage("");
    setMessageType("error");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/resend-otp`,
        { email }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        setMessageType("success");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4 relative overflow-hidden">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full absolute top-0 left-0 p-4 bg-blue-600 text-white shadow-md flex items-center justify-between px-6 z-10"
      >
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
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/30 backdrop-blur-lg shadow-2xl border border-white/30 rounded-2xl p-8 w-full max-w-md mt-24 relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-3">
          Verify OTP
        </h2>
        <p className="text-sm text-center text-gray-700 mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={submitHandler} className="space-y-5">

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              OTP
            </label>
            <input
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              pattern="[0-9]{6}"
              placeholder="123456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none tracking-widest"
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            {isSubmitting ? "Verifying..." : "Verify Account"}
          </motion.button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          <button
            type="button"
            onClick={resendOtp}
            disabled={isResending || !email}
            className="text-blue-500 hover:underline disabled:text-gray-400"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
          <span className="mx-2">|</span>
          Already verified?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
