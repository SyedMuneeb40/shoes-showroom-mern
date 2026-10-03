import { Link } from "react-router-dom";

import "./ShoeCard.css";

const ShoeCard = ({ shoe }) => {

    const isOutOfStock = shoe.stock <= 0;

    return (

        <div className="shoe-card">

            <Link
                to={`/shoes/${shoe._id}`}
                className="shoe-image-link"
            >

                <div className="shoe-image-container">

                    {isOutOfStock && (
                        <span className="stock-badge out">
                            Out of Stock
                        </span>
                    )}

                    {!isOutOfStock && shoe.stock <= 5 && (
                        <span className="stock-badge low">
                            Only {shoe.stock} left
                        </span>
                    )}

                    <img
                        src={shoe.image}
                        alt={shoe.name}
                        className="shoe-image"
                    />

                    <div className="image-overlay">
                        <span>
                            View Product →
                        </span>
                    </div>

                </div>

            </Link>


            <div className="shoe-info">

                <div className="shoe-top">

                    <span className="shoe-brand">
                        {shoe.brand}
                    </span>

                </div>


                <Link
                    to={`/shoes/${shoe._id}`}
                    className="shoe-name-link"
                >

                    <h2 className="shoe-name">
                        {shoe.name}
                    </h2>

                </Link>


                <p className="shoe-description">
                    {shoe.description}
                </p>


                <div className="shoe-bottom">

                    <div className="price-section">

                        <span className="price-label">
                            Price
                        </span>

                        <span className="shoe-price">
                            Rs. {shoe.price.toLocaleString()}
                        </span>

                    </div>


                    <Link
                        to={`/shoes/${shoe._id}`}
                        className="view-button"
                    >
                        <span>
                            View
                        </span>

                        <span className="arrow">
                            →
                        </span>
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default ShoeCard;