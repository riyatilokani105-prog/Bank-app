import API from "./axios";

// Dashboard Summary
export const getDashboard = async () => {
  const res = await API.get("/dashboard");
  return res.data;
};

// Dashboard Statistics
export const getStats = async () => {
  const res = await API.get("/stats");
  return res.data;
};

// Recent Collections
export const getRecentCollections = async () => {
  const res = await API.get("/dashboard/recentCollections");
  return res.data;
};

// Top Customers
export const getTopCustomers = async () => {
  const res = await API.get("/dashboard/topCustomers");
  return res.data;
};