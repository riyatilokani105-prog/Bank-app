import API from "./axios";

// Daily Collection Chart
export const getDailyStats = async () => {
  const res = await API.get("/stats/daily");
  return res.data;
};

// Monthly Collection Chart
export const getMonthlyStats = async () => {
  const res = await API.get("/stats/monthly");
  return res.data;
};

// Top Customers
export const getTopCustomers = async () => {
  const res = await API.get("/stats/top-customers");
  return res.data;
};