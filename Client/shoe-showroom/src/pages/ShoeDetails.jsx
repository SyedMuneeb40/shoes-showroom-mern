import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getShoesById } from "../services/shoeApi";
import { addToCart } from "../services/cartApi";
import { setCart } from "../store/cartSlice";

import "./ShoeDetails.css";

const ShoeDetails = () => {

    const { shoeId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shoe, setShoe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedSize, setSelectedSize] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [adding, setAdding] = useState(false);


    const handleAddToCart = async () => {

        setError("");
        setSuccessMessage("");

        if (!selectedSize) {
            setError("Please select a size first.");
            return;
        }

        try {

            setAdding(true);

            const data = await addToCart(
                shoeId,
                selectedSize
            );

            dispatch(setCart(data.cart));

            setSuccessMessage(
                data.message ||
                "Shoe added to cart successfully."
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to add item to cart."
            );

        } finally {

            setAdding(false);

        }
    };


    useEffect(() => {

        const fetchShoe = async () => {

            try {

                const data = await getShoesById(shoeId);

                setShoe(data);

            } catch (error) {

                console.log(error);

                setError("Unable to load shoe.");

            } finally {

                setLoading(false);

            }
        };

        fetchShoe();

    }, [shoeId]);


    if (loading) {

        return (
            <div className="details-loading">

                <div className="details-spinner"></div>

                <p>
                    Loading product...
                </p>

            </div>
        );
    }


    if (error === "Unable to load shoe.") {

        return (
            <div className="details-error">

                <div>
                    ⚠️
                </div>

                <h2>
                    Product not found
                </h2>

                <p>
                    Unable to load this product.
                </p>

                <button
                    onClick={() => navigate("/shoes")}
                >
                    Back to Shoes
                </button>

            </div>
        );
    }


    if (!shoe) {
        return null;
    }


    const isOutOfStock = shoe.stock <= 0;


    return (

        <div className="shoe-details-page">


            {/* Back */}

            <button
                className="back-button"
                onClick={() => navigate("/shoes")}
            >
                ← Back to Shoes
            </button>


            <div className="shoe-details-card">


                {/* Image */}

                <div className="details-image-section">

                    <div className="details-image">

                        {isOutOfStock && (
                            <span className="details-stock-badge">
                                Out of Stock
                            </span>
                        )}

                        {!isOutOfStock &&
                            shoe.stock <= 5 && (
                                <span className="details-low-stock">
                                    Only {shoe.stock} left
                                </span>
                            )}

                        <img
                            src={shoe.image}
                            alt={shoe.name}
                        />

                    </div>

                </div>


                {/* Information */}

                <div className="details-info">

                    <p className="details-brand">
                        {shoe.brand}
                    </p>


                    <h1>
                        {shoe.name}
                    </h1>


                    <div className="details-rating">
                        <span>
                            ★★★★★
                        </span>

                        <span>
                            Premium Collection
                        </span>
                    </div>


                    <div className="details-price">
                        Rs. {shoe.price.toLocaleString()}
                    </div>


                    <p className="details-description">
                        {shoe.description}
                    </p>


                    <div className="details-divider"></div>


                    {/* Stock */}

                    <div className="details-stock">

                        <span
                            className={
                                isOutOfStock
                                    ? "stock-dot out"
                                    : "stock-dot"
                            }
                        ></span>

                        {isOutOfStock
                            ? "Currently unavailable"
                            : `${shoe.stock} pairs available`
                        }

                    </div>


                    {/* Sizes */}

                    <div className="sizes">

                        <div className="size-heading">

                            <h3>
                                Select Size
                            </h3>

                            <span>
                                {selectedSize
                                    ? `Selected: ${selectedSize}`
                                    : "Choose your size"
                                }
                            </span>

                        </div>


                        <div className="size-list">

                            {shoe.sizes.map((size) => (

                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSize(size);
                                        setError("");
                                    }}
                                    className={
                                        selectedSize === size
                                            ? "selected-size"
                                            : ""
                                    }
                                    disabled={isOutOfStock}
                                >
                                    {size}
                                </button>

                            ))}

                        </div>

                    </div>


                    {/* Messages */}

                    {error && (
                        <div className="details-message error-message">
                            ⚠️ {error}
                        </div>
                    )}


                    {successMessage && (
                        <div className="details-message success-message">
                            ✓ {successMessage}
                        </div>
                    )}


                    {/* Add Cart */}

                    <button
                        className="add-cart-btn"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || adding}
                    >

                        {adding
                            ? "Adding to Cart..."
                            : isOutOfStock
                                ? "Out of Stock"
                                : "Add to Cart"
                        }

                        {!adding && !isOutOfStock && (
                            <span>
                                →
                            </span>
                        )}

                    </button>


                    {successMessage && (
                        <button
                            className="view-cart-btn"
                            onClick={() => navigate("/cart")}
                        >
                            View Cart
                        </button>
                    )}


                    {/* Benefits */}

                    <div className="product-benefits">

                        <div className="benefit">

                            <span className="benefit-icon">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Quality Products
                                </strong>

                                <small>
                                    Carefully selected footwear
                                </small>
                            </div>

                        </div>


                        <div className="benefit">

                            <span className="benefit-icon">
                                ↻
                            </span>

                            <div>
                                <strong>
                                    Easy Shopping
                                </strong>

                                <small>
                                    Simple and secure checkout
                                </small>
                            </div>

                        </div>


                        <div className="benefit">

                            <span className="benefit-icon">
                                🔒
                            </span>

                            <div>
                                <strong>
                                    Secure Payment
                                </strong>

                                <small>
                                    Safe online payments
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ShoeDetails;