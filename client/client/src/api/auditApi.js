import API from "./axios";

// Get All Audit Logs
export const getAuditLogs = async () => {
  const res = await API.get("/audit");
  return res.data;
};

// Search Audit Logs
export const searchAuditLogs = async (query) => {
  const res = await API.get(`/audit/search?query=${query}`);
  return res.data;
};

// Delete Audit Log
export const deleteAuditLog = async (id) => {
  const res = await API.delete(`/audit/${id}`);
  return res.data;
};