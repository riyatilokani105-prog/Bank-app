import API from "./axios";

// ==============================
// Get All Collections
// ==============================
export const getCollections = async () => {
  const { data } = await API.get("/collections");
  return data;
};

// ==============================
// Add Single Collection
// ==============================
export const addCollection = async (formData) => {
  const { data } = await API.post("/collections", formData);
  return data;
};

// ==============================
// Add Bulk Collection
// ==============================
export const bulkCollection = async ({ collections, forceSave = false }) => {
  console.log("Sending:", { collections, forceSave });

  const { data } = await API.post("/collections/bulk", {
    collections,
    forceSave,
  });

  return data;
};

// ==============================
// Delete Collection
// ==============================
export const deleteCollection = async (id) => {
  const { data } = await API.delete(`/collections/${id}`);
  return data;
};

// ==============================
// Customer Collection History
// ==============================
export const getCustomerCollections = async (customerId) => {
  const { data } = await API.get(`/collections/customer/${customerId}`);
  return data;
};

// ==============================
// Update Collection
// ==============================
export const updateCollection = async (id, collectionData) => {
  const { data } = await API.put(`/collections/${id}`, collectionData);
  return data;
};