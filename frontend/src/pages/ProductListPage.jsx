import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1000&q=80";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { search, category } })
      .then((res) => {
        const normalizedProducts = Array.isArray(res.data) ? res.data : [];
        if (!Array.isArray(res.data)) {
          toast.error("Products response was invalid. Please check backend API URL.");
        }
        setProducts(normalizedProducts);
      })
      .catch(() => {
        setProducts([]);
        toast.error("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [search, category]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.product === product._id);
    if (existing) existing.quantity += 1;
    else cart.push({ product: product._id, name: product.name, price: product.price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="pageSection">
      <h2>Product Listing</h2>
      <p className="mutedText">
        AI note: recommendations appear on each product details page based on similar category.
      </p>
      <div className="filters">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
        </select>
      </div>
      {loading ? (
        <p className="mutedText">Loading products...</p>
      ) : products.length ? (
        <div className="grid">
          {products.map((product) => (
            <div key={product._id} className="card">
              <img
                className="productImage"
                src={product.image || FALLBACK_IMAGE}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <h3>{product.name}</h3>
              <p className="mutedText">{product.category}</p>
              <p className="price">${product.price}</p>
              <div className="cardActions">
                <Link to={`/products/${product._id}`} className="btn btnGhost">
                  View Details
                </Link>
                <button className="btn btnPrimary" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mutedText">No products found for your filters.</p>
      )}
    </section>
  );
}

export default ProductListPage;
