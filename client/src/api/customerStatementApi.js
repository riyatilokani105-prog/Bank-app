import axiosInstance from "./axios";

export const getCustomerStatement = async (search) => {
  const { data } = await axiosInstance.get(
    `/customer-statement?search=${search}`
  );

  return data;
};