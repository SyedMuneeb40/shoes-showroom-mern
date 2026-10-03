import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authApi.js";

import {
    setCredentials,
    setLoading,
    setError
} from "../store/authSlice";

import "./Login.css";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await loginUser({
                email,
                password
            });

            dispatch(
                setCredentials({
                    user: data.user,
                    accessToken: data.accessToken
                })
            );

            if (data.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Invalid email or password"
                )
            );

        } finally {

            dispatch(setLoading(false));

        }
    };


    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* Left Side */}

                <div className="auth-showcase">

                    <div className="showcase-content">

                        <div className="brand-mark">
                            👟
                        </div>

                        <h1>
                            Step Into
                            <span> Style.</span>
                        </h1>

                        <p>
                            Discover premium footwear designed
                            for comfort, confidence and everyday style.
                        </p>

                        <div className="showcase-shoes">
                            👟 👞 👠
                        </div>

                    </div>

                </div>


                {/* Right Side */}

                <div className="auth-form-container">

                    <div className="auth-form-box">

                        <div className="mobile-logo">
                            👟 ShoeStore
                        </div>


                        <div className="auth-heading">

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to continue shopping
                            </p>

                        </div>


                        {error && (
                            <div className="auth-error">
                                ⚠️ {error}
                            </div>
                        )}


                        <form onSubmit={handleSubmit}>

                            <div className="input-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>


                            <div className="input-group">

                                <div className="password-label">

                                    <label>
                                        Password
                                    </label>

                                    <span>
                                        Forgot password?
                                    </span>

                                </div>


                                <div className="password-input">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
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
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign In →"}
                            </button>

                        </form>


                        <div className="auth-divider">
                            <span>OR</span>
                        </div>


                        <p className="auth-bottom">

                            Don't have an account?

                            <Link to="/register">
                                Create one
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;