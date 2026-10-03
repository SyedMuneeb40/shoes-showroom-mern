import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, NavLink } from "react-router-dom";

import { logout } from "../services/authApi";
import {
    clearAuth,
    setError,
    setLoading
} from "../store/authSlice";

import "./Navbar.css";

const NavBar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const { user, loading } = useSelector(
        (state) => state.auth
    );

    const { totalItems } = useSelector(
        (state) => state.cart
    );


    const handleLogout = async () => {

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            await logout();

            dispatch(clearAuth());

            navigate("/login");

        } catch (error) {

            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Logout Failed"
                )
            );

        } finally {

            dispatch(setLoading(false));

        }
    };


    const closeMenu = () => {
        setMenuOpen(false);
    };


    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* Logo */}

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    <span className="logo-icon">
                        👟
                    </span>

                    <span>
                        Shoe<span>-Showroom</span>
                    </span>
                </Link>


                {/* Desktop Navigation */}

                <div className="navbar-links">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Home
                    </NavLink>


                    <NavLink
                        to="/shoes"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Shoes
                    </NavLink>


                    {user?.role === "customer" && (
                        <>
                            <NavLink
                                to="/cart"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >
                                <span className="cart-link">
                                    Cart

                                    {totalItems > 0 && (
                                        <span className="cart-badge">
                                            {totalItems}
                                        </span>
                                    )}
                                </span>
                            </NavLink>


                            <NavLink
                                to="/orders"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >
                                Orders
                            </NavLink>
                        </>
                    )}


                    {user?.role === "admin" && (
                        <>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >
                                Dashboard
                            </NavLink>


                            <NavLink
                                to="/admin/shoes"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >
                                Manage Shoes
                            </NavLink>


                            <NavLink
                                to="/admin/orders"
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >
                                Orders
                            </NavLink>
                        </>
                    )}

                </div>


                {/* Right Side */}

                <div className="navbar-right">

                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="login-btn"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="register-btn"
                            >
                                Register
                            </Link>
                        </>
                    ) : (

                        <div className="user-section">

                            <div className="user-avatar">
                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div className="user-info">
                                <span className="user-greeting">
                                    Hi,
                                </span>

                                <span className="user-name">
                                    {user.name}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging out..."
                                    : "Logout"}
                            </button>

                        </div>
                    )}

                </div>


                {/* Mobile Menu Button */}

                <button
                    className="mobile-menu-btn"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

            </div>


            {/* Mobile Navigation */}

            {menuOpen && (
                <div className="mobile-menu">

                    <NavLink
                        to="/"
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/shoes"
                        onClick={closeMenu}
                    >
                        Shoes
                    </NavLink>


                    {user?.role === "customer" && (
                        <>
                            <NavLink
                                to="/cart"
                                onClick={closeMenu}
                            >
                                Cart
                                {totalItems > 0 &&
                                    ` (${totalItems})`}
                            </NavLink>

                            <NavLink
                                to="/orders"
                                onClick={closeMenu}
                            >
                                Orders
                            </NavLink>
                        </>
                    )}


                    {user?.role === "admin" && (
                        <>
                            <NavLink
                                to="/admin"
                                onClick={closeMenu}
                            >
                                Dashboard
                            </NavLink>

                            <NavLink to="/admin/shoes">
                                Manage Shoes
                            </NavLink>

                            <NavLink
                                to="/admin/orders"
                                onClick={closeMenu}
                            >
                                Orders
                            </NavLink>
                        </>
                    )}


                    {!user && (
                        <>
                            <NavLink
                                to="/login"
                                onClick={closeMenu}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                onClick={closeMenu}
                            >
                                Register
                            </NavLink>
                        </>
                    )}


                    {user && (
                        <button
                            onClick={() => {
                                closeMenu();
                                handleLogout();
                            }}
                            className="mobile-logout"
                        >
                            Logout
                        </button>
                    )}

                </div>
            )}

        </nav>
    );
};

export default NavBar;