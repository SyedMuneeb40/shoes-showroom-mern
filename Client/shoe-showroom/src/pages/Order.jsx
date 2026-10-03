import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getOrders,
    cancelOrder
} from "../services/orderApi";

import "./Order.css";


const Orders = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);


    const fetchOrders = async () => {

        try {

            setLoading(true);

            const data = await getOrders();

            console.log("ORDERS:", data);

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


    const handleCancel = async (orderId) => {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setCancellingId(orderId);

            const data = await cancelOrder(orderId);

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? data.order
                        : order
                )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to cancel order"
            );

        } finally {

            setCancellingId(null);

        }
    };


    const getStatusClass = (status) => {

        return `order-status status-${status}`;
    };


    const getPaymentClass = (status) => {

        return `payment-status payment-${status}`;
    };


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
            <div className="orders-loading">

                <div className="orders-spinner"></div>

                <p>
                    Loading your orders...
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
            <div className="orders-error">

                <div className="orders-error-icon">
                    ⚠️
                </div>

                <h2>
                    Something went wrong
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


    /*
    =========================
    EMPTY
    =========================
    */

    if (orders.length === 0) {

        return (
            <div className="orders-empty">

                <div className="orders-empty-icon">
                    📦
                </div>

                <h1>
                    No orders yet
                </h1>

                <p>
                    You haven't placed any orders yet.
                    Start exploring our collection and
                    find something you love.
                </p>

                <button
                    onClick={() => navigate("/shoes")}
                >
                    Start Shopping →
                </button>

            </div>
        );
    }


    return (

        <div className="orders-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="orders-header">

                <div>

                    <span className="orders-label">
                        ACCOUNT
                    </span>

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        Track and manage your recent orders.
                    </p>

                </div>

                <div className="orders-count">
                    <strong>
                        {orders.length}
                    </strong>

                    <span>
                        {orders.length === 1
                            ? "Order"
                            : "Orders"}
                    </span>
                </div>

            </div>


            {/* =========================
                ORDERS
            ========================= */}

            <div className="orders-list">

                {orders.map((order) => {

                    const canCancel =
                        order.status !== "shipped" &&
                        order.status !== "delivered" &&
                        order.status !== "cancelled";


                    return (

                        <div
                            className="order-card"
                            key={order._id}
                        >


                            {/* ORDER HEADER */}

                            <div className="order-card-header">

                                <div className="order-info">

                                    <span>
                                        ORDER
                                    </span>

                                    <strong>
                                        #{order._id.slice(-8).toUpperCase()}
                                    </strong>

                                </div>


                                <div className="order-date">

                                    <span>
                                        Placed on
                                    </span>

                                    <strong>
                                        {formatDate(order.createdAt)}
                                    </strong>

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="order-status-row">

                                <div className="status-item">

                                    <span className="status-label">
                                        Order Status
                                    </span>

                                    <span
                                        className={getStatusClass(
                                            order.status
                                        )}
                                    >
                                        {order.status}
                                    </span>

                                </div>


                                <div className="status-item">

                                    <span className="status-label">
                                        Payment
                                    </span>

                                    <span
                                        className={getPaymentClass(
                                            order.paymentStatus
                                        )}
                                    >
                                        {order.paymentStatus}
                                    </span>

                                </div>


                                <div className="status-item total-status">

                                    <span className="status-label">
                                        Total
                                    </span>

                                    <strong>
                                        Rs.{" "}
                                        {order.totalPrice.toLocaleString()}
                                    </strong>

                                </div>

                            </div>


                            {/* ITEMS */}

                            <div className="order-products">

                                {order.orderItems.map(
                                    (item, index) => (

                                        <div
                                            className="order-product"
                                            key={index}
                                        >

                                            <div className="order-product-image">

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


                                            <div className="order-product-info">

                                                <strong>
                                                    {
                                                        item.product?.name ||
                                                        "Product"
                                                    }
                                                </strong>

                                                <span>
                                                    {item.product?.brand}
                                                </span>

                                                <div className="product-meta">

                                                    <span>
                                                        Size:{" "}
                                                        <b>
                                                            {item.size}
                                                        </b>
                                                    </span>

                                                    <span>
                                                        Qty:{" "}
                                                        <b>
                                                            {item.quantity}
                                                        </b>
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="order-product-price">

                                                Rs.{" "}
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString()}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>


                            {/* ACTIONS */}

                            <div className="order-card-footer">

                                <button
                                    className="details-btn"
                                    onClick={() =>
                                        navigate(
                                            `/orders/${order._id}`
                                        )
                                    }
                                >
                                    View Order Details →
                                </button>


                                {canCancel && (

                                    <button
                                        className="cancel-order-btn"
                                        disabled={
                                            cancellingId ===
                                            order._id
                                        }
                                        onClick={() =>
                                            handleCancel(
                                                order._id
                                            )
                                        }
                                    >
                                        {cancellingId ===
                                        order._id
                                            ? "Cancelling..."
                                            : "Cancel Order"}
                                    </button>

                                )}

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
};


export default Orders;