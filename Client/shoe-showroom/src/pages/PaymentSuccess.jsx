import { Link, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("orderId");

    return (
        <div className="payment-page">

            <div className="payment-card">

                <div className="payment-icon payment-success-icon">
                    ✓
                </div>

                <span className="payment-label">
                    PAYMENT SUCCESSFUL
                </span>

                <h1>
                    Thank you for your order!
                </h1>

                <p className="payment-description">
                    Your payment has been submitted successfully.
                    Your order is now being processed.
                </p>

                {orderId && (
                    <div className="payment-order-box">

                        <div>
                            <span>Order ID</span>

                            <strong>
                                #{orderId.slice(-8).toUpperCase()}
                            </strong>
                        </div>

                        <div>
                            <span>Status</span>

                            <strong className="payment-paid">
                                PAYMENT RECEIVED
                            </strong>
                        </div>

                    </div>
                )}

                <div className="payment-actions">

                    <Link
                        to="/orders"
                        className="payment-primary"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/shoes"
                        className="payment-secondary"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default PaymentSuccess;