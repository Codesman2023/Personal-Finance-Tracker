import axios from "axios";

const baseURL = `${import.meta.env.VITE_BASE_URL}/user`;

export const updateBudgetSettings = async (monthlyBudgetLimit) => {
  const token = localStorage.getItem("token");

  return await axios.put(
    `${baseURL}/budget`,
    { monthlyBudgetLimit },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
