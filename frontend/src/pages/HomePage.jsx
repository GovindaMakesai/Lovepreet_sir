import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="hero">
      <p className="heroTag">AI-powered shopping assistant</p>
      <h1>AI-Based Online Shopping Recommendation and Price Prediction System</h1>
      <p className="heroText">
        Browse products, discover similar items instantly, and check predicted next prices
        before you purchase.
      </p>
      <div className="heroActions">
        <Link to="/products" className="btn btnPrimary">
          Explore Products
        </Link>
        <Link to="/auth" className="btn btnGhost">
          Get Started
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
