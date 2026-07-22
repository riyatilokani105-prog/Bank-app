import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getProfile, updateProfile } from "../../api/settingsApi";

const ProfileCard = () => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {

      const res = await getProfile();

      const user = res.user || res.data || res;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });

    } catch (err) {
      console.log(err);
    }
  };

  const changeHandler = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await updateProfile(formData);

      toast.success(res.message);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Profile Update Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="settings-card">

      <h2>Profile</h2>

      <form onSubmit={submitHandler}>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={changeHandler}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={changeHandler}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={changeHandler}
        />

        <button className="save-btn">

          {loading ? "Saving..." : "Update Profile"}

        </button>

      </form>

    </div>

  );

};

export default ProfileCard;