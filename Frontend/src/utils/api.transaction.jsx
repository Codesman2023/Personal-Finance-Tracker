import axios from "axios";

const baseURL = `${import.meta.env.VITE_BASE_URL}/transactions`;

export const getTransactions = async () => {
  const token = localStorage.getItem("token");

  return await axios.get(baseURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const downloadTransactionsCsv = async () => {
  const token = localStorage.getItem("token");

  return await axios.get(`${baseURL}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });
};

export const sendMonthlyReportEmail = async () => {
  const token = localStorage.getItem("token");

  return await axios.post(
    `${baseURL}/monthly-report`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createTransaction = async (data) => {
   const token = localStorage.getItem("token");

   return await axios.post(baseURL, data, {
    headers: {
        Authorization: `Bearer ${token}`,
        },
    });
};

export const updateTransaction = async (id, data) => {
  const token = localStorage.getItem("token");

    const res = await axios.put(`${baseURL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`},
        });
    return res.data;
};

export const deleteTransaction = async (id) => {
  const token = localStorage.getItem("token");
  
    const res = await axios.delete(`${baseURL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
