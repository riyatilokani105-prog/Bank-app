import API from "./axios";

// Get all receipts
export const getReceipts = async () => {
  const res = await API.get("/receipt");
  return res.data;
};

// Get single receipt
export const getReceipt = async (id) => {
  const res = await API.get(`/receipt/${id}`);
  return res.data;
};

// Download PDF Receipt
export const downloadReceipt = async (id) => {
  const res = await API.get(`/receipt/download/${id}`, {
    responseType: "blob",
  });

  return res.data;
};