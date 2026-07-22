import API from "./axios";

// Get All Customers
export const getCustomers = async () => {
  const res = await API.get("/customers");
  return res.data;
};

// Add Customer
export const addCustomer = async (data) => {
  const res = await API.post("/customers", data);
  return res.data;
};

// Update Customer
export const updateCustomer = async (id, data) => {
  const res = await API.put(`/customers/${id}`, data);
  return res.data;
};

// Delete Customer
export const deleteCustomer = async (id) => {

    const res = await API.delete(`/customers/${id}`);

    return res.data;

};

// Search Customer
export const searchCustomer = async (query) => {
  const res = await API.get(`/customers/search?query=${query}`);
  return res.data;
};