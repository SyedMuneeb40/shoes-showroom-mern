import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getCart,
    increaseQuantity,
    decreaseQuantity,
    removeItemFromCart
} from "../services/cartApi";

import { setCart } from "../store/cartSlice";
import { checkout } from "../services/orderApi";
import { createPayment } from "../services/paymentApi";

import "./Cart.css";


const Cart = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        items,
        totalItems,
        totalPrice
    } = useSelector((state) => state.cart);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);


    /*
    =========================
    CHECKOUT
    =========================
    */

    const handleCheckout = async () => {

        if (items.length === 0) {
            return;
        }

        try {

            setCheckoutLoading(true);

            // 1. Create order
            const orderData = await checkout();

            console.log("ORDER CREATED:", orderData);

            const orderId = orderData.order._id;


            // 2. Create PayFast payment
            const paymentData = await createPayment(orderId);

            console.log("PAYMENT DATA:", paymentData);


            // 3. Submit PayFast form
            const form = document.createElement("form");

            form.method = "POST";
            form.action = paymentData.payfast_url;

            Object.entries(paymentData.data).forEach(
                ([key, value]) => {

                    const input =
                        document.createElement("input");

                    input.type = "hidden";
                    input.name = key;
                    input.value = value;

                    form.appendChild(input);
                }
            );

            document.body.appendChild(form);

            form.submit();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to proceed to payment"
            );

            setCheckoutLoading(false);
        }
    };


    /*
    =========================
    INCREASE
    =========================
    */

    const handleIncrease = async (shoeId, shoeSize) => {

        const key = `${shoeId}-${shoeSize}`;

        try {

            setActionLoading(key);

            const data =
                await increaseQuantity(
                    shoeId,
                    shoeSize
                );

            dispatch(setCart(data.cart));

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to increase quantity"
            );

        } finally {

            setActionLoading(null);
        }
    };


    /*
    =========================
    DECREASE
    =========================
    */

    const handleDecrease = async (shoeId, shoeSize) => {

        const key = `${shoeId}-${shoeSize}`;

        try {

            setActionLoading(key);

            const data =
                await decreaseQuantity(
                    shoeId,
                    shoeSize
                );

            dispatch(setCart(data.cart));

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to decrease quantity"
            );

        } finally {

            setActionLoading(null);
        }
    };


    /*
    =========================
    REMOVE
    =========================
    */

    const handleRemove = async (shoeId, shoeSize) => {

        const key = `${shoeId}-${shoeSize}`;

        try {

            setActionLoading(key);

            const data =
                await removeItemFromCart(
                    shoeId,
                    shoeSize
                );

            dispatch(setCart(data.cart));

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to remove item"
            );

        } finally {

            setActionLoading(null);
        }
    };


    /*
    =========================
    FETCH CART
    =========================
    */

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const data = await getCart();

                console.log("CART:", data);

                dispatch(setCart(data.cart));

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load cart"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchCart();

    }, [dispatch]);


    /*
    =========================
    LOADING
    =========================
    */

    if (loading) {

        return (
            <div className="cart-loading">

                <div className="cart-spinner"></div>

                <p>
                    Loading your cart...
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
            <div className="cart-error">

                <div className="cart-error-icon">
                    ⚠️
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>

            </div>
        );
    }


    /*
    =========================
    EMPTY CART
    =========================
    */

    if (items.length === 0) {

        return (
            <div className="empty-cart-page">

                <div className="empty-cart-icon">
                    🛒
                </div>

                <h1>
                    Your cart is empty
                </h1>

                <p>
                    Looks like you haven't added anything
                    to your cart yet.
                </p>

                <button
                    onClick={() => navigate("/shoes")}
                >
                    Continue Shopping →
                </button>

            </div>
        );
    }


    return (

        <div className="cart-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="cart-header">

                <div>

                    <span className="cart-label">
                        SHOPPING CART
                    </span>

                    <h1>
                        Your Cart
                    </h1>

                    <p>
                        {totalItems}{" "}
                        {totalItems === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart
                    </p>

                </div>


                <button
                    className="continue-shopping"
                    onClick={() => navigate("/shoes")}
                >
                    ← Continue Shopping
                </button>

            </div>


            {/* =========================
                CART CONTENT
            ========================= */}

            <div className="cart-layout">


                {/* ITEMS */}

                <div className="cart-items">


                    {items.map((item) => {

                        const key =
                            `${item.shoe._id}-${item.size}`;

                        const isLoading =
                            actionLoading === key;

                        const itemTotal =
                            item.shoe.price *
                            item.quantity;


                        return (

                            <div
                                className="cart-item"
                                key={key}
                            >


                                {/* IMAGE */}

                                <div
                                    className="cart-item-image"
                                    onClick={() =>
                                        navigate(
                                            `/shoes/${item.shoe._id}`
                                        )
                                    }
                                >

                                    <img
                                        src={item.shoe.image}
                                        alt={item.shoe.name}
                                    />

                                </div>


                                {/* INFO */}

                                <div className="cart-item-info">

                                    <span className="cart-item-brand">
                                        {item.shoe.brand}
                                    </span>

                                    <h2>
                                        {item.shoe.name}
                                    </h2>

                                    <div className="cart-item-meta">

                                        <span>
                                            Size:{" "}
                                            <strong>
                                                {item.size}
                                            </strong>
                                        </span>

                                        <span className="meta-divider">
                                            |
                                        </span>

                                        <span>
                                            Rs.{" "}
                                            {item.shoe.price.toLocaleString()}
                                        </span>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="cart-item-actions">

                                        <div className="quantity-control">

                                            <button
                                                onClick={() =>
                                                    handleDecrease(
                                                        item.shoe._id,
                                                        item.size
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleIncrease(
                                                        item.shoe._id,
                                                        item.size
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                +
                                            </button>

                                        </div>


                                        <button
                                            className="remove-btn"
                                            onClick={() =>
                                                handleRemove(
                                                    item.shoe._id,
                                                    item.size
                                                )
                                            }
                                            disabled={isLoading}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>


                                {/* TOTAL */}

                                <div className="cart-item-total">

                                    <span>
                                        Item Total
                                    </span>

                                    <strong>
                                        Rs.{" "}
                                        {itemTotal.toLocaleString()}
                                    </strong>

                                </div>

                            </div>
                        );
                    })}

                </div>


                {/* =========================
                    SUMMARY
                ========================= */}

                <aside className="cart-summary">

                    <div className="summary-header">

                        <h2>
                            Order Summary
                        </h2>

                        <span>
                            {totalItems} items
                        </span>

                    </div>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            Rs. {totalPrice.toLocaleString()}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Delivery
                        </span>

                        <strong className="free-delivery">
                            FREE
                        </strong>

                    </div>


                    <div className="summary-divider"></div>


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            Rs. {totalPrice.toLocaleString()}
                        </strong>

                    </div>


                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                    >

                        {checkoutLoading
                            ? "Redirecting to Payment..."
                            : "Proceed to Checkout →"
                        }

                    </button>


                    <div className="secure-checkout">

                        <span>
                            🔒
                        </span>

                        <div>
                            <strong>
                                Secure Checkout
                            </strong>

                            <small>
                                Your payment is processed securely
                            </small>
                        </div>

                    </div>


                    <div className="payment-methods">

                        <span>
                            We accept
                        </span>

                        <div>
                            CARD
                        </div>

                        <div>
                            PAYFAST
                        </div>

                    </div>

                </aside>

            </div>

        </div>
    );
};


export default Cart;