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

    }

    catch (error) {

        toast.error(

            error?.response?.data?.message ||

            "Invalid Email or Password"

        );

    }

    finally {

        setLoading(false);

    }

};

    return (

        <div className="login">

            <div className="login-card">

                <h1>Daily Collection</h1>

                <p>Sign in to continue</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
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

                        {

                            loading

                                ? "Signing In..."

                                : "Login"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

};

export default Login;