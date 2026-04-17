import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { search, category } })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [search, category]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.product === product._id);
    if (existing) existing.quantity += 1;
    else cart.push({ product: product._id, name: product.name, price: product.price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setNotice(`${product.name} added to cart`);
    setTimeout(() => setNotice(""), 1500);
  };

  return (
    <section className="pageSection">
      <h2>Product Listing</h2>
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
      {notice && <p className="notice">{notice}</p>}
      {loading ? (
        <p className="mutedText">Loading products...</p>
      ) : products.length ? (
        <div className="grid">
          {products.map((product) => (
            <div key={product._id} className="card">
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
