import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getOrderById } from "../services/orderApi";

import "./OrderDetails.css";


const OrderDetails = () => {

    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchOrder = async () => {

            try {

                const data = await getOrderById(orderId);

                console.log("ORDER:", data);

                setOrder(data.order);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load order"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchOrder();

    }, [orderId]);


    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(
            "en-PK",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    };


    const formatDateTime = (date) => {

        return new Date(date).toLocaleString(
            "en-PK",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );
    };


    const getStatusClass = (status) => {

        return `detail-status status-${status}`;
    };


    /*
    =========================
    LOADING
    =========================
    */

    if (loading) {

        return (
            <div className="order-details-loading">

                <div className="order-details-spinner"></div>

                <p>
                    Loading order details...
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
            <div className="order-details-error">

                <div>
                    ⚠️
                </div>

                <h2>
                    Unable to load order
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() => navigate("/orders")}
                >
                    Back to Orders
                </button>

            </div>
        );
    }


    if (!order) {

        return (
            <div className="order-details-error">

                <div>
                    📦
                </div>

                <h2>
                    Order not found
                </h2>

                <button
                    onClick={() => navigate("/orders")}
                >
                    Back to Orders
                </button>

            </div>
        );
    }


    const isCancelled =
        order.status === "cancelled";


    return (

        <div className="order-details-page">


            {/* =========================
                BACK
            ========================= */}

            <button
                className="order-back-btn"
                onClick={() => navigate("/orders")}
            >
                ← Back to Orders
            </button>


            {/* =========================
                HEADER
            ========================= */}

            <div className="order-details-header">

                <div>

                    <span className="order-details-label">
                        ORDER DETAILS
                    </span>

                    <h1>
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>

                    <p>
                        Placed on{" "}
                        {formatDate(order.createdAt)}
                    </p>

                </div>


                <span
                    className={getStatusClass(order.status)}
                >
                    {order.status}
                </span>

            </div>


            {/* =========================
                STATUS TRACKER
            ========================= */}

            {!isCancelled && (

                <div className="order-tracker">

                    <div className="tracker-title">
                        <h2>
                            Order Status
                        </h2>

                        <span>
                            {order.status === "delivered"
                                ? "Order completed"
                                : "Your order is being processed"
                            }
                        </span>
                    </div>


                    <div className="tracker">

                        <div
                            className={
                                `tracker-step ${
                                    [
                                        "pending",
                                        "confirmed",
                                        "shipped",
                                        "delivered"
                                    ].includes(order.status)
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <div className="tracker-circle">
                                ✓
                            </div>

                            <span>
                                Pending
                            </span>

                        </div>


                        <div
                            className={
                                `tracker-line ${
                                    [
                                        "confirmed",
                                        "shipped",
                                        "delivered"
                                    ].includes(order.status)
                                        ? "active"
                                        : ""
                                }`
                            }
                        ></div>


                        <div
                            className={
                                `tracker-step ${
                                    [
                                        "confirmed",
                                        "shipped",
                                        "delivered"
                                    ].includes(order.status)
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <div className="tracker-circle">
                                ✓
                            </div>

                            <span>
                                Confirmed
                            </span>

                        </div>


                        <div
                            className={
                                `tracker-line ${
                                    [
                                        "shipped",
                                        "delivered"
                                    ].includes(order.status)
                                        ? "active"
                                        : ""
                                }`
                            }
                        ></div>


                        <div
                            className={
                                `tracker-step ${
                                    [
                                        "shipped",
                                        "delivered"
                                    ].includes(order.status)
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <div className="tracker-circle">
                                ✓
                            </div>

                            <span>
                                Shipped
                            </span>

                        </div>


                        <div
                            className={
                                `tracker-line ${
                                    order.status === "delivered"
                                        ? "active"
                                        : ""
                                }`
                            }
                        ></div>


                        <div
                            className={
                                `tracker-step ${
                                    order.status === "delivered"
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <div className="tracker-circle">
                                ✓
                            </div>

                            <span>
                                Delivered
                            </span>

                        </div>

                    </div>

                </div>
            )}


            {/* CANCELLED */}

            {isCancelled && (

                <div className="cancelled-banner">

                    <span>
                        ✕
                    </span>

                    <div>

                        <strong>
                            Order Cancelled
                        </strong>

                        <p>
                            This order has been cancelled.
                        </p>

                    </div>

                </div>
            )}


            {/* =========================
                MAIN GRID
            ========================= */}

            <div className="order-details-grid">


                {/* =========================
                    ITEMS
                ========================= */}

                <div className="details-items-card">

                    <div className="details-card-header">

                        <div>

                            <h2>
                                Order Items
                            </h2>

                            <span>
                                {order.orderItems.length}{" "}
                                {order.orderItems.length === 1
                                    ? "product"
                                    : "products"}
                            </span>

                        </div>

                    </div>


                    <div className="details-items">

                        {order.orderItems.map(
                            (item, index) => {

                                const itemTotal =
                                    item.price *
                                    item.quantity;


                                return (

                                    <div
                                        className="details-item"
                                        key={index}
                                    >


                                        <div className="details-item-image">

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


                                        <div className="details-item-info">

                                            <span className="item-brand">
                                                {item.product?.brand}
                                            </span>

                                            <h3>
                                                {
                                                    item.product?.name ||
                                                    "Product"
                                                }
                                            </h3>

                                            <div className="item-meta">

                                                <span>
                                                    Size:{" "}
                                                    <strong>
                                                        {item.size}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Quantity:{" "}
                                                    <strong>
                                                        {item.quantity}
                                                    </strong>
                                                </span>

                                            </div>

                                        </div>


                                        <div className="details-item-price">

                                            <span>
                                                Rs.{" "}
                                                {item.price.toLocaleString()}{" "}
                                                each
                                            </span>

                                            <strong>
                                                Rs.{" "}
                                                {itemTotal.toLocaleString()}
                                            </strong>

                                        </div>

                                    </div>

                                );
                            }
                        )}

                    </div>

                </div>


                {/* =========================
                    SUMMARY
                ========================= */}

                <div className="order-summary-card">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-detail-row">

                        <span>
                            Order ID
                        </span>

                        <strong>
                            #{order._id.slice(-8).toUpperCase()}
                        </strong>

                    </div>


                    <div className="summary-detail-row">

                        <span>
                            Order Date
                        </span>

                        <strong>
                            {formatDate(order.createdAt)}
                        </strong>

                    </div>


                    <div className="summary-detail-row">

                        <span>
                            Payment
                        </span>

                        <span
                            className={
                                `payment-detail ${
                                    order.paymentStatus === "paid"
                                        ? "paid"
                                        : order.paymentStatus === "failed"
                                            ? "failed"
                                            : "pending"
                                }`
                            }
                        >
                            {order.paymentStatus}
                        </span>

                    </div>


                    <div className="summary-divider"></div>


                    <div className="summary-total-row">

                        <span>
                            Total
                        </span>

                        <strong>
                            Rs.{" "}
                            {order.totalPrice.toLocaleString()}
                        </strong>

                    </div>


                    <div className="order-secure-box">

                        <span>
                            🔒
                        </span>

                        <div>

                            <strong>
                                Secure Order
                            </strong>

                            <small>
                                Your order information is protected.
                            </small>

                        </div>

                    </div>


                    <button
                        className="back-orders-btn"
                        onClick={() => navigate("/orders")}
                    >
                        View All Orders
                    </button>

                </div>

            </div>


            {/* =========================
                ORDER DATE INFO
            ========================= */}

            <div className="order-created-info">

                Order created on{" "}
                {formatDateTime(order.createdAt)}

            </div>

        </div>
    );
};


export default OrderDetails;