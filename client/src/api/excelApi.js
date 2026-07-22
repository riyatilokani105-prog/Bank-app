import API from "./axios";

export const importCustomers = async (formData) => {
  const res = await API.post("/excel/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const exportCustomers = async () => {
  const res = await API.get("/excel/export", {
    responseType: "blob",
  });

  return res;
};

export const exportCollections = async () => {
  const res = await API.get("/excel/export-collections", {
    responseType: "blob",
  });

  return res;
};