import axios from "./axios";

export const getCustomerStatement = async (search) => {
  const { data } = await axios.get(
    `/customer-statement?search=${encodeURIComponent(search)}`
  );

  return data;
};

export const downloadCustomerStatement = async (search) => {
  const response = await axios.get(
    `/customer-statement/pdf?search=${encodeURIComponent(search)}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};