import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailure = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div>
            <h1>Payment Failed ❌</h1>

            <p>
                Your payment was cancelled or could not be completed.
            </p>

            {orderId && (
                <p>
                    <strong>Order ID:</strong> {orderId}
                </p>
            )}

            <button onClick={() => navigate("/orders")}>
                View My Orders
            </button>

            <button onClick={() => navigate("/shoes")}>
                Continue Shopping
            </button>
        </div>
    );
};

export default PaymentFailure;