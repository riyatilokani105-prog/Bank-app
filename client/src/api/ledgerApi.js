import API from "./axios";

// Get All Ledger Entries
export const getLedger = async () => {
  const res = await API.get("/ledger");
  return res.data;
};

// Get Single Ledger
export const getLedgerById = async (id) => {
  const res = await API.get(`/ledger/${id}`);
  return res.data;
};

// Customer Ledger
export const getCustomerLedger = async (id) => {
  const res = await API.get(`/ledger/customer/${id}`);
  return res.data;
};

// Delete Ledger
export const deleteLedger = async (id) => {
  const res = await API.delete(`/ledger/${id}`);
  return res.data;
};