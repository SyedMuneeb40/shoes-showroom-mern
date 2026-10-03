import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../services/authApi.js";

import {
    setLoading,
    setError
} from "../store/authSlice";

import "./Register.css";

const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            await registerUser({
                username,
                email,
                password
            });

            navigate("/login");

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Registration failed"
                )
            );

        } finally {

            dispatch(setLoading(false));

        }
    };


    return (
        <div className="register-page">

            <div className="register-container">

                {/* Left Side */}

                <div className="register-showcase">

                    <div className="register-showcase-content">

                        <div className="register-brand-mark">
                            👟
                        </div>

                        <h1>
                            Find Your
                            <span> Perfect Fit.</span>
                        </h1>

                        <p>
                            Create your account and explore
                            footwear made for every step of
                            your journey.
                        </p>

                        <div className="register-shoes">
                            👟 👞 👠
                        </div>

                    </div>

                </div>


                {/* Right Side */}

                <div className="register-form-container">

                    <div className="register-form-box">

                        <div className="register-mobile-logo">
                            👟 ShoeStore
                        </div>


                        <div className="register-heading">

                            <h2>
                                Create account
                            </h2>

                            <p>
                                Join ShoeStore today
                            </p>

                        </div>


                        {error && (
                            <div className="register-error">
                                ⚠️ {error}
                            </div>
                        )}


                        <form onSubmit={handleSubmit}>

                            <div className="register-input-group">

                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="register-input-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="register-input-group">

                                <label>
                                    Password
                                </label>

                                <div className="register-password">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword
                                            ? "🙈"
                                            : "👁️"}
                                    </button>

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create Account →"}
                            </button>

                        </form>


                        <div className="register-divider">
                            <span>OR</span>
                        </div>


                        <p className="register-bottom">

                            Already have an account?

                            <Link to="/login">
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;