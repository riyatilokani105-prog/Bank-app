import API from "./axios";

// Get Reports
export const getReport = async (filters = {}) => {
  const res = await API.get("/reports", {
    params: filters,
  });

  return res.data;
};

// Get Summary
export const getReportSummary = async () => {
  const res = await API.get("/reports/summary");
  return res.data;
};

// Export Excel
export const exportExcel = async () => {
  return await API.get("/reports/excel", {
    responseType: "blob",
  });
};

// Export PDF
export const exportPDF = async () => {
  return await API.get("/reports/pdf", {
    responseType: "blob",
  });
};