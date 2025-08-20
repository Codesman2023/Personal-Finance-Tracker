import axios from "axios";

export const getTransactions = async () => {
  const token = localStorage.getItem("token");

  return await axios.get("http://localhost:3000/transactions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTransaction = async (data) => {
   const token = localStorage.getItem("token");

   return await axios.post("http://localhost:3000/transactions", data, {
    headers: {
        Authorization: `Bearer ${token}`,
        },
    });
};

export const updateTransaction = async (id, data) => {
  const token = localStorage.getItem("token");

    const res = await axios.put(`http://localhost:3000/transactions/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`},
        });
    return res.data;
};

export const deleteTransaction = async (id) => {
  const token = localStorage.getItem("token");
  
    const res = await axios.delete(`http://localhost:3000/transactions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};