import { useEffect, useMemo, useState } from "react";
import { getShoes } from "../services/shoeApi";
import ShoeCard from "../component/ShoeCard";
import "./Shoes.css";

const Shoes = () => {

    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [brand, setBrand] = useState("all");
    const [sort, setSort] = useState("default");


    useEffect(() => {

        const fetchShoes = async () => {

            try {

                const data = await getShoes();

                setShoes(data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load shoes"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchShoes();

    }, []);


    const brands = useMemo(() => {

        return [
            ...new Set(
                shoes.map((shoe) => shoe.brand)
            )
        ];

    }, [shoes]);


    const filteredShoes = useMemo(() => {

        let result = [...shoes];


        // Search

        if (search.trim()) {

            const query = search.toLowerCase();

            result = result.filter((shoe) =>
                shoe.name?.toLowerCase().includes(query) ||
                shoe.brand?.toLowerCase().includes(query)
            );
        }


        // Brand

        if (brand !== "all") {

            result = result.filter(
                (shoe) => shoe.brand === brand
            );

        }


        // Sorting

        if (sort === "low-high") {

            result.sort(
                (a, b) => a.price - b.price
            );

        }

        if (sort === "high-low") {

            result.sort(
                (a, b) => b.price - a.price
            );

        }

        if (sort === "newest") {

            result.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

        }


        return result;

    }, [shoes, search, brand, sort]);


    if (loading) {

        return (
            <div className="shoes-loading">

                <div className="loading-spinner"></div>

                <p>Loading shoes...</p>

            </div>
        );
    }


    if (error) {

        return (
            <div className="shoes-error">

                <div className="error-icon">
                    ⚠️
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );
    }


    return (

        <div className="shoes-page">


            {/* Hero */}

            <section className="shoes-hero">

                <div>

                    <span className="hero-label">
                        OUR COLLECTION
                    </span>

                    <h1>
                        Find your
                        <span> perfect pair.</span>
                    </h1>

                    <p>
                        Explore our collection of footwear
                        designed for comfort and style.
                    </p>

                </div>

                <div className="hero-shoe">
                    👟
                </div>

            </section>


            {/* Toolbar */}

            <section className="shoes-toolbar">

                <div className="search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search shoes or brands..."
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


                <div className="filters">

                    <select
                        value={brand}
                        onChange={(e) =>
                            setBrand(e.target.value)
                        }
                    >

                        <option value="all">
                            All Brands
                        </option>

                        {brands.map((brandName) => (

                            <option
                                key={brandName}
                                value={brandName}
                            >
                                {brandName}
                            </option>

                        ))}

                    </select>


                    <select
                        value={sort}
                        onChange={(e) =>
                            setSort(e.target.value)
                        }
                    >

                        <option value="default">
                            Sort By
                        </option>

                        <option value="newest">
                            Newest
                        </option>

                        <option value="low-high">
                            Price: Low to High
                        </option>

                        <option value="high-low">
                            Price: High to Low
                        </option>

                    </select>

                </div>

            </section>


            {/* Results */}

            <div className="results-row">

                <p>
                    <strong>
                        {filteredShoes.length}
                    </strong>{" "}
                    {filteredShoes.length === 1
                        ? "product"
                        : "products"}
                </p>

                {(search || brand !== "all") && (

                    <button
                        className="clear-filters"
                        onClick={() => {
                            setSearch("");
                            setBrand("all");
                            setSort("default");
                        }}
                    >
                        Clear filters
                    </button>

                )}

            </div>


            {/* Products */}

            {filteredShoes.length === 0 ? (

                <div className="no-shoes">

                    <div>
                        🔎
                    </div>

                    <h2>
                        No shoes found
                    </h2>

                    <p>
                        Try changing your search or filters.
                    </p>

                    <button
                        onClick={() => {
                            setSearch("");
                            setBrand("all");
                            setSort("default");
                        }}
                    >
                        View All Shoes
                    </button>

                </div>

            ) : (

                <div className="shoes-grid">

                    {filteredShoes.map((shoe) => (

                        <ShoeCard
                            key={shoe._id}
                            shoe={shoe}
                        />

                    ))}

                </div>

            )}

        </div>
    );
};

export default Shoes;