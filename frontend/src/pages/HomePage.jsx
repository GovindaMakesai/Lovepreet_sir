import { Link } from "react-router-dom";

function HomePage({ user }) {
  return (
    <section className="hero">
      <p className="heroTag">AI-powered shopping assistant</p>
      <h1>AI-Based Online Shopping Recommendation and Price Prediction System</h1>
      <p className="heroText">
        Browse products, discover similar items instantly, and check predicted next prices
        before you purchase.
      </p>
      <div className="aiSteps card">
        <h3>How to see AI working</h3>
        <p>1) Open any product from Product Listing.</p>
        <p>2) Scroll to Recommended Products (AI similarity).</p>
        <p>3) Click Predict Next Price (AI trend prediction).</p>
      </div>
      <div className="heroActions">
        <Link to="/products" className="btn btnPrimary">
          Explore Products
        </Link>
        {user ? (
          <Link to="/cart" className="btn btnGhost">
            Go to Cart
          </Link>
        ) : (
          <Link to="/auth" className="btn btnGhost">
            Login / Register
          </Link>
        )}
      </div>
    </section>
  );
}

export default HomePage;
