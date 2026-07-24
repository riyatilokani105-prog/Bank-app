import { useState } from "react";
import toast from "react-hot-toast";

import { changePassword } from "../../api/settingsApi";

const ChangePassword = () => {

  const [loading,setLoading]=useState(false);

  const [formData,setFormData]=useState({

    oldPassword:"",
    newPassword:"",
    confirmPassword:""

  });

  const changeHandler=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };

  const submitHandler=async(e)=>{

    e.preventDefault();

    if(formData.newPassword!==formData.confirmPassword){

      return toast.error("Passwords do not match");

    }

    try{

      setLoading(true);

      const res = await changePassword({

  currentPassword: formData.oldPassword,

  newPassword: formData.newPassword,

});

      toast.success(res.message);

      setFormData({

        oldPassword:"",
        newPassword:"",
        confirmPassword:""

      });

    }

    catch(err){

      toast.error(

        err.response?.data?.message||

        "Unable to Change Password"

      );

    }

    finally{

      setLoading(false);

    }

  };

  return(

    <div className="settings-card">

      <h2>Change Password</h2>

      <form onSubmit={submitHandler}>

        <input
        type="password"
        name="oldPassword"
        placeholder="Current Password"
        value={formData.oldPassword}
        onChange={changeHandler}
        />

        <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={changeHandler}
        />

        <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={changeHandler}
        />

        <button className="save-btn">

          {loading ? "Updating..." : "Change Password"}

        </button>

      </form>

    </div>

  );

};

export default ChangePassword;