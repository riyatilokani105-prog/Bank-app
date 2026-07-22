import API from "./axios";

export const getProfile = async () => {

  const res = await API.get("/auth/profile");

  return res.data;

};

export const updateProfile = async (data) => {

  const res = await API.put("/auth/profile", data);

  return res.data;

};

export const changePassword = async (data) => {

  const res = await API.put("/auth/change-password", data);

  return res.data;

};

export const updateTheme = async (data) => {

  const res = await API.put("/settings/theme", data);

  return res.data;

};

export const updateSystemSettings = async (data) => {

  const res = await API.put("/settings/system", data);

  return res.data;

};