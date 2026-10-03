import { useEffect, useMemo, useState } from "react";

import {
    getAllOrders,
    updateOrderStatus
} from "../../services/orderApi";

import "./AdminOrders.css";


const AdminOrders = () => {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);

    const [search, setSearch] = useState("");

    const [filterStatus, setFilterStatus] = useState("all");


    /*
    =========================
    ALLOWED TRANSITIONS
    =========================
    */

    const getNextStatuses = (status) => {

        const transitions = {

            pending: ["cancelled"],

            confirmed: ["shipped"],

            shipped: ["delivered"],

            delivered: [],

            cancelled: []

        };

        return transitions[status] || [];
    };


    /*
    =========================
    FETCH ORDERS
    =========================
    */

    const fetchOrders = async () => {

        try {

            setLoading(true);

            const data = await getAllOrders();


            setOrders(data.orders || []);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load orders"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchOrders();

    }, []);


    /*
    =========================
    UPDATE STATUS
    =========================
    */

    const handleStatusChange = async (
        orderId,
        status
    ) => {

        try {

            setUpdatingId(orderId);

            const data =
                await updateOrderStatus(
                    orderId,
                    status
                );

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? {
                            ...order,
                            status:
                                data.order.status
                        }
                        : order
                )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to update order"
            );

        } finally {

            setUpdatingId(null);
        }
    };


    /*
    =========================
    FILTER
    =========================
    */

    const filteredOrders = useMemo(() => {

        return orders.filter((order) => {

            const query =
                search.toLowerCase().trim();


            const matchesSearch =
                !query ||
                order._id
                    ?.toLowerCase()
                    .includes(query) ||
                order.user?.name
                    ?.toLowerCase()
                    .includes(query) ||
                order.user?.email
                    ?.toLowerCase()
                    .includes(query);


            const matchesStatus =
                filterStatus === "all" ||
                order.status === filterStatus;


            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [orders, search, filterStatus]);


    /*
    =========================
    STATS
    =========================
    */

    const stats = useMemo(() => {

        return {

            total: orders.length,

            pending: orders.filter(
                order => order.status === "pending"
            ).length,

            confirmed: orders.filter(
                order => order.status === "confirmed"
            ).length,

            shipped: orders.filter(
                order => order.status === "shipped"
            ).length,

            delivered: orders.filter(
                order => order.status === "delivered"
            ).length

        };

    }, [orders]);


    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-PK",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };


    /*
    =========================
    LOADING
    =========================
    */

    if (loading) {

        return (
            <div className="admin-orders-loading">

                <div className="admin-orders-spinner"></div>

                <p>
                    Loading orders...
                </p>

            </div>
        );
    }


    /*
    =========================
    ERROR
    =========================
    */

    if (error) {

        return (
            <div className="admin-orders-error">

                <div>
                    ⚠️
                </div>

                <h2>
                    Unable to load orders
                </h2>

                <p>
                    {error}
                </p>

                <button onClick={fetchOrders}>
                    Try Again
                </button>

            </div>
        );
    }


    return (

        <div className="admin-orders-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="admin-orders-header">

                <div>

                    <span className="admin-orders-label">
                        ADMIN PANEL
                    </span>

                    <h1>
                        Manage Orders
                    </h1>

                    <p>
                        Monitor customer orders and
                        update their delivery status.
                    </p>

                </div>

            </div>


            {/* =========================
                STATS
            ========================= */}

            <div className="order-stats">

                <div className="order-stat-card">

                    <span>
                        Total Orders
                    </span>

                    <strong>
                        {stats.total}
                    </strong>

                </div>


                <div className="order-stat-card pending-stat">

                    <span>
                        Pending
                    </span>

                    <strong>
                        {stats.pending}
                    </strong>

                </div>


                <div className="order-stat-card confirmed-stat">

                    <span>
                        Confirmed
                    </span>

                    <strong>
                        {stats.confirmed}
                    </strong>

                </div>


                <div className="order-stat-card shipped-stat">

                    <span>
                        Shipped
                    </span>

                    <strong>
                        {stats.shipped}
                    </strong>

                </div>


                <div className="order-stat-card delivered-stat">

                    <span>
                        Delivered
                    </span>

                    <strong>
                        {stats.delivered}
                    </strong>

                </div>

            </div>


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="admin-orders-toolbar">

                <div className="admin-order-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by order ID, customer or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                        >
                            ×
                        </button>
                    )}

                </div>


                <select
                    value={filterStatus}
                    onChange={(e) =>
                        setFilterStatus(e.target.value)
                    }
                >

                    <option value="all">
                        All Orders
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="confirmed">
                        Confirmed
                    </option>

                    <option value="shipped">
                        Shipped
                    </option>

                    <option value="delivered">
                        Delivered
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>

                </select>

            </div>


            {/* =========================
                EMPTY
            ========================= */}

            {filteredOrders.length === 0 ? (

                <div className="admin-orders-empty">

                    <div>
                        📦
                    </div>

                    <h2>
                        No orders found
                    </h2>

                    <p>
                        Try changing your search
                        or filter.
                    </p>

                </div>

            ) : (

                <div className="admin-orders-list">

                    {filteredOrders.map((order) => {

                        const nextStatuses =
                            getNextStatuses(
                                order.status
                            );

                        const isUpdating =
                            updatingId === order._id;


                        return (

                            <div
                                className="admin-order-card"
                                key={order._id}
                            >


                                {/* HEADER */}

                                <div className="admin-order-card-header">

                                    <div>

                                        <span>
                                            ORDER
                                        </span>

                                        <strong>
                                            #
                                            {order._id
                                                .slice(-8)
                                                .toUpperCase()}
                                        </strong>

                                    </div>


                                    <span className="admin-order-date">
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </span>

                                </div>


                                {/* CUSTOMER */}

                                <div className="admin-customer">

                                    <div className="customer-avatar">
                                        {order.user?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>

                                    <div>

                                        <strong>
                                            {order.user?.username ||
                                                "Unknown Customer"}
                                        </strong>

                                        <span>
                                            {order.user?.email ||
                                                "No email"}
                                        </span>

                                    </div>

                                </div>


                                {/* SUMMARY */}

                                <div className="admin-order-summary">

                                    <div>

                                        <span>
                                            Order Status
                                        </span>

                                        <span
                                            className={
                                                `admin-status status-${order.status}`
                                            }
                                        >
                                            {order.status}
                                        </span>

                                    </div>


                                    <div>

                                        <span>
                                            Payment
                                        </span>

                                        <span
                                            className={
                                                `admin-payment payment-${order.paymentStatus}`
                                            }
                                        >
                                            {order.paymentStatus}
                                        </span>

                                    </div>


                                    <div>

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            Rs.{" "}
                                            {order.totalPrice.toLocaleString()}
                                        </strong>

                                    </div>

                                </div>


                                {/* ITEMS */}

                                <div className="admin-order-items">

                                    <div className="items-title">
                                        <span>
                                            ORDER ITEMS
                                        </span>

                                        <span>
                                            {order.orderItems.length}{" "}
                                            {order.orderItems.length === 1
                                                ? "item"
                                                : "items"}
                                        </span>
                                    </div>


                                    {order.orderItems.map(
                                        (item, index) => (

                                            <div
                                                className="admin-order-item"
                                                key={index}
                                            >

                                                <div className="admin-item-image">

                                                    <img
                                                        src={
                                                            item.product?.image
                                                        }
                                                        alt={
                                                            item.product?.name ||
                                                            "Product"
                                                        }
                                                    />

                                                </div>


                                                <div className="admin-item-info">

                                                    <strong>
                                                        {
                                                            item.product?.name ||
                                                            "Product"
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            item.product?.brand
                                                        }
                                                    </span>

                                                    <small>
                                                        Size:{" "}
                                                        {item.size}
                                                        {" • "}
                                                        Qty:{" "}
                                                        {item.quantity}
                                                    </small>

                                                </div>


                                                <strong className="admin-item-price">
                                                    Rs.{" "}
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString()}
                                                </strong>

                                            </div>
                                        )
                                    )}

                                </div>


                                {/* FOOTER */}

                                <div className="admin-order-footer">

                                    <div>

                                        <span>
                                            Update Status
                                        </span>

                                        <select
                                            value={order.status}
                                            disabled={
                                                isUpdating ||
                                                nextStatuses.length === 0
                                            }
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option
                                                value={order.status}
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : order.status}
                                            </option>

                                            {nextStatuses.map(
                                                (status) => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {nextStatuses.length === 0 && (

                                        <span className="final-status">
                                            {order.status ===
                                            "delivered"
                                                ? "✓ Order completed"
                                                : "Order closed"}
                                        </span>

                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
};


export default AdminOrders;