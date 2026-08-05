import API from "./axios";

export const getAdminProfile = async () => {
  const response = await axiosInstance.get("/admin/profile");
  return response.data;
};

export const updateAdminProfile = async (data) => {
  const response = await axiosInstance.put("/admin/profile", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axiosInstance.put(
    "/admin/change-password",
    data
  );

  return response.data;
};