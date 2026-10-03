import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShoes } from "../services/shoeApi";
import ShoeCard from "../component/ShoeCard";
import "./Home.css";

const Home = () => {
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShoes = async () => {
            try {
                const data = await getShoes();
                setShoes(data || []);
            } catch (error) {
                console.error("Failed to load shoes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShoes();
    }, []);

    const featuredShoes = shoes.slice(0, 4);

    return (
        <div className="home-page">

            {/* HERO */}

            <section className="home-hero">

                <div className="hero-content">

                    <span className="hero-label">
                        SHOE_SHOWROOM
                    </span>

                    <h1>
                        Step Into
                        <span> Your Style.</span>
                    </h1>

                    <p>
                        Discover premium footwear designed for
                        comfort, confidence and everyday style.
                    </p>

                    <div className="hero-actions">

                        <Link
                            to="/shoes"
                            className="hero-primary"
                        >
                            Shop Collection
                            <span>→</span>
                        </Link>

                        <Link
                            to="/shoes"
                            className="hero-secondary"
                        >
                            Explore Shoes
                        </Link>

                    </div>

                    <div className="hero-features">

                        <div>
                            <strong>Premium</strong>
                            <span>Quality footwear</span>
                        </div>

                        <div>
                            <strong>Multiple</strong>
                            <span>Sizes available</span>
                        </div>

                        <div>
                            <strong>Secure</strong>
                            <span>Easy checkout</span>
                        </div>

                    </div>

                </div>


                <div className="hero-visual">

                    <div className="hero-circle" />

                    {shoes[0]?.image && (
                        <img
                            src={shoes[0].image}
                            alt={shoes[0].name}
                            className="hero-shoe-image"
                        />
                    )}

                    <div className="hero-floating-card">

                        <span>Featured</span>

                        <strong>
                            {shoes[0]?.brand || "Premium"}
                        </strong>

                        <p>
                            {shoes[0]?.name ||
                                "Premium Collection"}
                        </p>

                    </div>

                </div>

            </section>


            {/* TRUST STRIP */}

            <section className="home-trust">

                <div>
                    <span>◈</span>

                    <div>
                        <strong>
                            Premium Quality
                        </strong>

                        <p>
                            Carefully selected footwear
                        </p>
                    </div>
                </div>

                <div>
                    <span>✓</span>

                    <div>
                        <strong>
                            Easy Shopping
                        </strong>

                        <p>
                            Simple and secure checkout
                        </p>
                    </div>
                </div>

                <div>
                    <span>↻</span>

                    <div>
                        <strong>
                            Multiple Styles
                        </strong>

                        <p>
                            Find the right pair for you
                        </p>
                    </div>
                </div>

            </section>


            {/* FEATURED PRODUCTS */}

            <section className="featured-section">

                <div className="home-section-header">

                    <div>
                        <span>
                            OUR COLLECTION
                        </span>

                        <h2>
                            Featured Shoes
                        </h2>

                        <p>
                            Explore some of our latest
                            footwear.
                        </p>
                    </div>

                    <Link to="/shoes">
                        View All Shoes →
                    </Link>

                </div>


                {loading ? (

                    <div className="home-product-loading">

                        {[1, 2, 3, 4].map((item) => (
                            <div
                                className="home-skeleton"
                                key={item}
                            >
                                <div />
                                <span />
                                <span />
                                <span />
                            </div>
                        ))}

                    </div>

                ) : featuredShoes.length > 0 ? (

                    <div className="home-products-grid">

                        {featuredShoes.map((shoe) => (
                            <ShoeCard
                                key={shoe._id}
                                shoe={shoe}
                            />
                        ))}

                    </div>

                ) : (

                    <div className="home-empty">
                        <h3>
                            Collection coming soon
                        </h3>

                        <p>
                            New shoes will appear here.
                        </p>
                    </div>

                )}

            </section>


            {/* CTA */}

            <section className="home-cta">

                <div>

                    <span>
                        FIND YOUR NEXT PAIR
                    </span>

                    <h2>
                        Your style starts
                        <br />
                        from the ground up.
                    </h2>

                    <p>
                        Browse our complete collection and
                        find something made for you.
                    </p>

                    <Link to="/shoes">
                        Explore Collection →
                    </Link>

                </div>

            </section>


            {/* FOOTER */}

            <footer className="home-footer">

                <div className="footer-brand">

                    <strong>
                        Shoe<span>_Showroom</span>
                    </strong>

                    <p>
                        Premium footwear for every step.
                    </p>

                </div>

                <div className="footer-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/shoes">
                        Shoes
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>

                </div>

                <p className="footer-copy">
                    © {new Date().getFullYear()} Shoe_Showroom
                </p>

            </footer>

        </div>
    );
};

export default Home;