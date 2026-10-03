import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getShoes } from "../../services/shoeApi";
import { getAllOrders } from "../../services/orderApi";

import "./adminDashboard.css";

const AdminDashboard = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const [shoes, setShoes] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [shoeData, orderData] = await Promise.all([
                    getShoes(),
                    getAllOrders()
                ]);

                setShoes(shoeData.shoes || []);
                setOrders(orderData.orders || []);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const stats = useMemo(() => {
        const pendingOrders = orders.filter(
            (order) => order.status === "pending"
        ).length;

        const lowStock = shoes.filter(
            (shoe) => shoe.stock > 0 && shoe.stock <= 5
        ).length;

        const outOfStock = shoes.filter(
            (shoe) => shoe.stock === 0
        ).length;

        return {
            products: shoes.length,
            orders: orders.length,
            pendingOrders,
            lowStock,
            outOfStock
        };
    }, [shoes, orders]);

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 5);
    }, [orders]);

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-PK",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getStatusClass = (status) => {
        return `dashboard-status ${status}`;
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-loading">
                    <div className="dashboard-spinner" />
                    <h2>Loading dashboard...</h2>
                    <p>Getting your latest store data.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* HEADER */}

            <header className="dashboard-header">

                <div>
                    <span className="dashboard-eyebrow">
                        SHOE_SHOWROOM / ADMIN
                    </span>

                    <h1>
                        Welcome back,{" "}
                        {user?.name || "Admin"}
                    </h1>

                    <p>
                        Here's what's happening with your
                        showroom today.
                    </p>
                </div>

                <div className="admin-profile">

                    <div className="admin-avatar">
                        {(user?.name || "A")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {user?.name || "Admin"}
                        </strong>

                        <span>
                            {user?.email || "Administrator"}
                        </span>
                    </div>

                </div>

            </header>


            {/* ERROR */}

            {error && (
                <div className="dashboard-error">
                    <span>!</span>

                    <div>
                        <strong>
                            Dashboard data unavailable
                        </strong>

                        <p>{error}</p>
                    </div>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Retry
                    </button>
                </div>
            )}


            {/* STATS */}

            <section className="dashboard-stats">

                <div className="stat-card">

                    <div className="stat-icon">
                        ◈
                    </div>

                    <div>
                        <span>
                            Total Products
                        </span>

                        <strong>
                            {stats.products}
                        </strong>

                        <small>
                            Products in showroom
                        </small>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        #
                    </div>

                    <div>
                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {stats.orders}
                        </strong>

                        <small>
                            All customer orders
                        </small>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon warning">
                        !
                    </div>

                    <div>
                        <span>
                            Pending Orders
                        </span>

                        <strong>
                            {stats.pendingOrders}
                        </strong>

                        <small>
                            Need attention
                        </small>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon danger">
                        ⚠
                    </div>

                    <div>
                        <span>
                            Low Stock
                        </span>

                        <strong>
                            {stats.lowStock}
                        </strong>

                        <small>
                            {stats.outOfStock} out of stock
                        </small>
                    </div>

                </div>

            </section>


            {/* QUICK ACTIONS */}

            <section className="dashboard-section">

                <div className="section-title">

                    <div>
                        <h2>Quick Actions</h2>

                        <p>
                            Manage your showroom quickly.
                        </p>
                    </div>

                </div>


                <div className="quick-actions">

                    <button
                        onClick={() =>
                            navigate("/admin/shoes/create")
                        }
                        className="quick-action primary"
                    >
                        <span className="action-icon">
                            +
                        </span>

                        <span>
                            <strong>
                                Add New Shoe
                            </strong>

                            <small>
                                Create a new product
                            </small>
                        </span>

                        <b>→</b>
                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/shoes")
                        }
                        className="quick-action"
                    >
                        <span className="action-icon">
                            ◈
                        </span>

                        <span>
                            <strong>
                                Manage Shoes
                            </strong>

                            <small>
                                Edit your inventory
                            </small>
                        </span>

                        <b>→</b>
                    </button>


                    <button
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                        className="quick-action"
                    >
                        <span className="action-icon">
                            #
                        </span>

                        <span>
                            <strong>
                                Manage Orders
                            </strong>

                            <small>
                                View customer orders
                            </small>
                        </span>

                        <b>→</b>
                    </button>

                </div>

            </section>


            {/* RECENT ORDERS */}

            <section className="dashboard-section">

                <div className="section-title">

                    <div>
                        <h2>Recent Orders</h2>

                        <p>
                            Latest orders from your customers.
                        </p>
                    </div>

                    <Link to="/admin/orders">
                        View All →
                    </Link>

                </div>


                {recentOrders.length === 0 ? (

                    <div className="no-orders">
                        <div>◌</div>

                        <h3>
                            No orders yet
                        </h3>

                        <p>
                            Customer orders will appear here.
                        </p>
                    </div>

                ) : (

                    <div className="recent-orders">

                        {recentOrders.map((order) => (

                            <div
                                className="recent-order"
                                key={order._id}
                            >

                                <div className="order-customer">

                                    <div className="customer-avatar">
                                        {(
                                            order.user?.name ||
                                            "C"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {order.user?.username ||
                                                "Customer"}
                                        </strong>

                                        <span>
                                            {order.user?.email ||
                                                "—"}
                                        </span>
                                    </div>

                                </div>


                                <div className="order-info">

                                    <span>
                                        Order
                                    </span>

                                    <strong>
                                        #
                                        {order._id
                                            ?.slice(-8)
                                            .toUpperCase()}
                                    </strong>

                                </div>


                                <div className="order-info">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        Rs.{" "}
                                        {Number(
                                            order.totalPrice || 0
                                        ).toLocaleString()}
                                    </strong>

                                </div>


                                <div className="order-info date">

                                    <span>
                                        Date
                                    </span>

                                    <strong>
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </strong>

                                </div>


                                <span
                                    className={getStatusClass(
                                        order.status
                                    )}
                                >
                                    {order.status}
                                </span>

                            </div>

                        ))}

                    </div>
                )}

            </section>


            {/* INVENTORY ALERT */}

            {(stats.lowStock > 0 ||
                stats.outOfStock > 0) && (

                <section className="inventory-alert">

                    <div className="inventory-alert-icon">
                        ⚠
                    </div>

                    <div>
                        <h3>
                            Inventory needs attention
                        </h3>

                        <p>
                            {stats.lowStock > 0 &&
                                `${stats.lowStock} product${
                                    stats.lowStock > 1
                                        ? "s are"
                                        : " is"
                                } running low.`}

                            {stats.lowStock > 0 &&
                                stats.outOfStock > 0 &&
                                " "}

                            {stats.outOfStock > 0 &&
                                `${stats.outOfStock} product${
                                    stats.outOfStock > 1
                                        ? "s are"
                                        : " is"
                                } out of stock.`}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/admin/shoes")
                        }
                    >
                        Check Inventory →
                    </button>

                </section>
            )}

        </div>
    );
};

export default AdminDashboard;