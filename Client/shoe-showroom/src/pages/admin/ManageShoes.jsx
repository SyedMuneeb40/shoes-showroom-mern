import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getShoes,
    deleteShoe
} from "../../services/shoeApi";
import "./ManageShoes.css";

const ManageShoes = () => {
    const navigate = useNavigate();

    const [shoes, setShoes] = useState([]);
    const [search, setSearch] = useState("");
    const [brandFilter, setBrandFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const fetchShoes = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getShoes();

            setShoes( data || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load shoes."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShoes();
    }, []);

    const brands = useMemo(() => {
        return [
            ...new Set(
                shoes
                    .map((shoe) => shoe.brand)
                    .filter(Boolean)
            )
        ].sort();
    }, [shoes]);

    const filteredShoes = useMemo(() => {
        return shoes.filter((shoe) => {

            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                shoe.name?.toLowerCase().includes(searchText) ||
                shoe.brand?.toLowerCase().includes(searchText);

            const matchesBrand =
                brandFilter === "all" ||
                shoe.brand === brandFilter;

            return matchesSearch && matchesBrand;
        });
    }, [shoes, search, brandFilter]);

    const handleDelete = async (shoe) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${shoe.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(shoe._id);

            await deleteShoe(shoe._id);

            setShoes((prev) =>
                prev.filter((item) => item._id !== shoe._id)
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete shoe."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return {
                label: "Out of Stock",
                className: "out-stock"
            };
        }

        if (stock <= 5) {
            return {
                label: "Low Stock",
                className: "low-stock"
            };
        }

        return {
            label: "In Stock",
            className: "in-stock"
        };
    };

    return (
        <div className="manage-shoes-page">

            {/* HEADER */}

            <header className="manage-shoes-header">

                <div>
                    <span className="manage-eyebrow">
                        SHOE_SHOWROOM
                    </span>

                    <h1>Manage Shoes</h1>

                    <p>
                        Manage your products, inventory and pricing.
                    </p>
                </div>

                <div className="header-actions">

                    <button
                        className="dashboard-btn"
                        onClick={() => navigate("/admin")}
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="add-shoe-btn"
                        onClick={() =>
                            navigate("/admin/shoes/create")
                        }
                    >
                        + Add Shoe
                    </button>

                </div>

            </header>


            {/* TOOLBAR */}

            <section className="shoes-toolbar">

                <div className="search-wrapper">

                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search by name or brand..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => setSearch("")}
                        >
                            ×
                        </button>
                    )}

                </div>


                <select
                    value={brandFilter}
                    onChange={(e) =>
                        setBrandFilter(e.target.value)
                    }
                >
                    <option value="all">
                        All Brands
                    </option>

                    {brands.map((brand) => (
                        <option
                            value={brand}
                            key={brand}
                        >
                            {brand}
                        </option>
                    ))}
                </select>

            </section>


            {/* RESULTS INFO */}

            <div className="results-row">

                <span>
                    Showing{" "}
                    <strong>{filteredShoes.length}</strong>{" "}
                    {filteredShoes.length === 1
                        ? "product"
                        : "products"}
                </span>

                {(search || brandFilter !== "all") && (
                    <button
                        onClick={() => {
                            setSearch("");
                            setBrandFilter("all");
                        }}
                    >
                        Clear filters
                    </button>
                )}

            </div>


            {/* ERROR */}

            {error && (
                <div className="manage-error">
                    <span>!</span>
                    {error}

                    <button onClick={fetchShoes}>
                        Retry
                    </button>
                </div>
            )}


            {/* LOADING */}

            {loading ? (

                <div className="shoes-loading">

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            className="shoe-skeleton"
                            key={item}
                        >
                            <div className="skeleton-image" />

                            <div className="skeleton-line large" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line small" />
                        </div>
                    ))}

                </div>

            ) : filteredShoes.length === 0 ? (

                <div className="empty-shoes">

                    <div className="empty-icon">
                        ◌
                    </div>

                    <h2>
                        No shoes found
                    </h2>

                    <p>
                        {shoes.length === 0
                            ? "You haven't added any shoes yet."
                            : "Try changing your search or filter."}
                    </p>

                    {shoes.length === 0 ? (
                        <button
                            onClick={() =>
                                navigate("/admin/shoes/create")
                            }
                        >
                            + Add Your First Shoe
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setSearch("");
                                setBrandFilter("all");
                            }}
                        >
                            Clear Filters
                        </button>
                    )}

                </div>

            ) : (

                <div className="shoes-grid">

                    {filteredShoes.map((shoe) => {

                        const stockStatus =
                            getStockStatus(shoe.stock);

                        return (
                            <article
                                className="admin-shoe-card"
                                key={shoe._id}
                            >

                                {/* IMAGE */}

                                <div className="admin-shoe-image">

                                    <img
                                        src={shoe.image}
                                        alt={shoe.name}
                                    />

                                    <span
                                        className={`stock-badge ${stockStatus.className}`}
                                    >
                                        {stockStatus.label}
                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="admin-shoe-content">

                                    <div className="shoe-title-row">

                                        <div>
                                            <span className="shoe-brand">
                                                {shoe.brand}
                                            </span>

                                            <h2>
                                                {shoe.name}
                                            </h2>
                                        </div>

                                        <strong className="shoe-price">
                                            Rs.{" "}
                                            {Number(
                                                shoe.price
                                            ).toLocaleString()}
                                        </strong>

                                    </div>


                                    {shoe.description && (
                                        <p className="shoe-description">
                                            {shoe.description}
                                        </p>
                                    )}


                                    {/* META */}

                                    <div className="shoe-meta">

                                        <div>
                                            <span>
                                                Stock
                                            </span>

                                            <strong>
                                                {shoe.stock}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Sizes
                                            </span>

                                            <strong>
                                                {shoe.sizes?.length || 0}
                                            </strong>
                                        </div>

                                    </div>


                                    {/* SIZES */}

                                    <div className="admin-size-list">

                                        {shoe.sizes?.map(
                                            (size) => (
                                                <span
                                                    key={size}
                                                >
                                                    {size}
                                                </span>
                                            )
                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="shoe-actions">

                                        <button
                                            className="edit-shoe-btn"
                                            onClick={() =>
                                               navigate(`/admin/shoes/edit/${shoe._id}`)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-shoe-btn"
                                            disabled={
                                                deletingId ===
                                                shoe._id
                                            }
                                            onClick={() =>
                                                handleDelete(shoe)
                                            }
                                        >
                                            {deletingId === shoe._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default ManageShoes;