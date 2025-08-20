import axios from "axios";

const token = "your_token_here"; // Make sure to replace this with your actual token

const API = axios.create({
    baseURL: "http://localhost:3000/transactions", // Update if using different port
    headers: { Authorization: `Bearer ${token}` }
});

export default API;