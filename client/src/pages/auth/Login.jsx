import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "./Login.css";

import { loginUser } from "../../api/authApi";

const Login = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await loginUser(formData);

      localStorage.setItem(
        "token",
        response.token
      );

      toast.success("Welcome Back");

      navigate("/dashboard");

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Invalid Email or Password"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login">

      <div className="login-card">

        <div className="bank-title">

          <h1>Rajura Nagri Sahakari Path Sanstha Maryadit</h1>

          <h2>Ballarpur Branch</h2>

          <h3>राजुरा नागरी सहकारी पतसंस्था मर्यादित</h3>

          <h4>बल्लारपूर शाखा</h4>

        </div>

        <div className="login-heading">

          <h5>Daily Collection Management System</h5>

          <p>Login in to continue</p>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );

};

export default Login;