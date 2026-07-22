import API from "./axios";

export const checkBackup = async () => {
  const res = await API.get("/backup/check");
  return res.data;
};

export const createBackup = async () => {
  const res = await API.post("/backup/create");
  return res.data;
};

export const deleteBackupData = async () => {
  const res = await API.delete("/backup/delete");
  return res.data;
};

export const getBackupHistory = async () => {
  const res = await API.get("/backup/history");
  return res.data;
};