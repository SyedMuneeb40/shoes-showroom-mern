import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createShoe } from "../../services/shoeApi";
import "./CreateShoe.css";

const CreateShoe = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        price: "",
        description: "",
        stock: ""
    });

    const [sizes, setSizes] = useState([]);
    const [sizeInput, setSizeInput] = useState("");

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        text: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const addSize = () => {
        const size = Number(sizeInput);

        if (!size || size < 1) {
            return;
        }

        if (sizes.includes(size)) {
            setSizeInput("");
            return;
        }

        setSizes((prev) =>
            [...prev, size].sort((a, b) => a - b)
        );

        setSizeInput("");
    };

    const removeSize = (sizeToRemove) => {
        setSizes((prev) =>
            prev.filter((size) => size !== sizeToRemove)
        );
    };

    const handleSizeKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSize();
        }
    };

    const handleImage = (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage({
                type: "error",
                text: "Please select a valid image."
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage({
                type: "error",
                text: "Image size must be less than 5MB."
            });
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));

        setMessage({
            type: "",
            text: ""
        });
    };

    const handleFileChange = (e) => {
        handleImage(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        setDragging(false);

        const file = e.dataTransfer.files[0];

        handleImage(file);
    };

    const removeImage = () => {
        setImage(null);
        setPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage({
            type: "",
            text: ""
        });

        if (!image) {
            setMessage({
                type: "error",
                text: "Please upload a shoe image."
            });
            return;
        }

        if (sizes.length === 0) {
            setMessage({
                type: "error",
                text: "Please add at least one shoe size."
            });
            return;
        }

        if (Number(formData.price) <= 0) {
            setMessage({
                type: "error",
                text: "Price must be greater than 0."
            });
            return;
        }

        if (Number(formData.stock) < 0) {
            setMessage({
                type: "error",
                text: "Stock cannot be negative."
            });
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();

            data.append("name", formData.name.trim());
            data.append("brand", formData.brand.trim());
            data.append("price", formData.price);
            data.append("description", formData.description.trim());
            data.append("stock", formData.stock);
            data.append("sizes", JSON.stringify(sizes));
            data.append("image", image);

            await createShoe(data);

            setMessage({
                type: "success",
                text: "Shoe created successfully!"
            });

            setTimeout(() => {
                navigate("/admin/shoes");
            }, 1000);

        } catch (error) {
            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ||
                    "Failed to create shoe."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-shoe-page">

            <div className="create-shoe-header">
                <div>
                    <span className="create-shoe-eyebrow">
                        SHOE_SHOWROOM
                    </span>

                    <h1>Create New Shoe</h1>

                    <p>
                        Add a new product to your showroom inventory.
                    </p>
                </div>

                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate("/admin")}
                >
                    ← Dashboard
                </button>
            </div>

            {message.text && (
                <div className={`form-message ${message.type}`}>
                    <span>
                        {message.type === "success" ? "✓" : "!"}
                    </span>

                    {message.text}
                </div>
            )}

            <form
                className="create-shoe-layout"
                onSubmit={handleSubmit}
            >

                {/* LEFT SIDE */}
                <div className="create-shoe-main">

                    <section className="form-card">

                        <div className="section-heading">
                            <div>
                                <h2>Product Information</h2>
                                <p>Basic information about your shoe.</p>
                            </div>
                        </div>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Shoe Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Air Max 270"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Nike"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Price
                                </label>

                                <div className="input-prefix">
                                    <span>Rs.</span>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="25000"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="50"
                                    min="0"
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group description-group">

                            <div className="label-row">
                                <label>Description</label>

                                <span>
                                    {formData.description.length}/500
                                </span>
                            </div>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the shoe, material, comfort, style..."
                                maxLength="500"
                                rows="6"
                            />

                        </div>

                    </section>


                    {/* SIZES */}
                    <section className="form-card">

                        <div className="section-heading">
                            <div>
                                <h2>Available Sizes</h2>
                                <p>
                                    Add the sizes customers can purchase.
                                </p>
                            </div>
                        </div>

                        <div className="size-input-row">

                            <input
                                type="number"
                                value={sizeInput}
                                onChange={(e) =>
                                    setSizeInput(e.target.value)
                                }
                                onKeyDown={handleSizeKeyDown}
                                placeholder="e.g. 42"
                                min="1"
                            />

                            <button
                                type="button"
                                onClick={addSize}
                            >
                                + Add Size
                            </button>

                        </div>

                        <div className="size-chips">

                            {sizes.length === 0 ? (
                                <span className="no-sizes">
                                    No sizes added yet
                                </span>
                            ) : (
                                sizes.map((size) => (
                                    <div
                                        className="size-chip"
                                        key={size}
                                    >
                                        <span>{size}</span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSize(size)
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}

                        </div>

                    </section>

                </div>


                {/* RIGHT SIDE */}
                <div className="create-shoe-sidebar">

                    <section className="form-card image-card">

                        <div className="section-heading">
                            <div>
                                <h2>Product Image</h2>
                                <p>Upload a clear product image.</p>
                            </div>
                        </div>

                        {!preview ? (

                            <div
                                className={`upload-box ${
                                    dragging ? "dragging" : ""
                                }`}
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() =>
                                    setDragging(false)
                                }
                                onDrop={handleDrop}
                            >

                                <div className="upload-icon">
                                    ↑
                                </div>

                                <h3>
                                    Drop your image here
                                </h3>

                                <p>
                                    or click to browse from your computer
                                </p>

                                <span>
                                    PNG, JPG or WEBP · Max 5MB
                                </span>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    hidden
                                />

                            </div>

                        ) : (

                            <div className="image-preview">

                                <img
                                    src={preview}
                                    alt="Shoe preview"
                                />

                                <div className="image-overlay">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        Replace
                                    </button>

                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={removeImage}
                                    >
                                        Remove
                                    </button>

                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    hidden
                                />

                            </div>

                        )}

                    </section>


                    {/* SUMMARY */}
                    <section className="form-card product-summary">

                        <h2>Product Summary</h2>

                        <div className="summary-row">
                            <span>Product</span>
                            <strong>
                                {formData.name || "—"}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>Brand</span>
                            <strong>
                                {formData.brand || "—"}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>Price</span>
                            <strong>
                                {formData.price
                                    ? `Rs. ${Number(
                                        formData.price
                                    ).toLocaleString()}`
                                    : "—"}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>Stock</span>
                            <strong>
                                {formData.stock || "0"}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>Sizes</span>
                            <strong>
                                {sizes.length}
                            </strong>
                        </div>

                    </section>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/admin")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Creating...
                                </>
                            ) : (
                                "Create Shoe"
                            )}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
};

export default CreateShoe;