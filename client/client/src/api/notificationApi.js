import API from "./axios";

export const getNotifications=async()=>{

const res=await API.get("/notifications");

return res.data;

};

export const markRead=async(id)=>{

const res=await API.put(`/notifications/${id}`);

return res.data;

};