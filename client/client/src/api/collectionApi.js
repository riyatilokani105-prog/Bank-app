import API from "./axios";

// Get All Collections
export const getCollections = async () => {
  const { data } = await API.get("/collections");
  return data;
};

// Add Collection
export const addCollection = async (formData) => {
  const { data } = await API.post("/collections", formData);
  return data;
};

// Delete Collection
export const deleteCollection = async (id) => {
  const { data } = await API.delete(`/collections/${id}`);
  return data;
};

// Get Customer Collections
export const getCustomerCollections = async (customerId) => {
  const { data } = await API.get(`/collections/customer/${customerId}`);
  return data;
};

export const updateCollection = async (id, data) => {
  const res = await API.put(`/collections/${id}`, data);
  return res.data;
};