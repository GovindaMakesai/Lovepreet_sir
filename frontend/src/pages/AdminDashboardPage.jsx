import { useEffect, useState } from "react";
import api from "../api";

function AdminDashboardPage({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: 0,
    stock: 0,
    image: "",
    description: ""
  });

  const loadData = async () => {
    const [productsRes, ordersRes, usersRes] = await Promise.all([
      api.get("/products"),
      api.get("/admin/orders"),
      api.get("/admin/users")
    ]);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    if (user?.role === "admin") loadData();
  }, [user]);

  const createProduct = async (e) => {
    e.preventDefault();
    await api.post("/products", {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    });
    setForm({
      name: "",
      category: "Electronics",
      price: 0,
      stock: 0,
      image: "",
      description: ""
    });
    loadData();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    loadData();
  };

  if (user?.role !== "admin") return <p>Admin access required.</p>;

  return (
    <section className="pageSection">
      <h2>Admin Dashboard</h2>
      <p className="mutedText">Manage products and monitor users/orders.</p>
      <form onSubmit={createProduct} className="form">
        <input
          value={form.name}
          placeholder="Product name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
        </select>
        <input value={form.price} type="number" onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input value={form.stock} type="number" onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input
          value={form.image}
          placeholder="Image URL (optional)"
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <input
          value={form.description}
          placeholder="Description (optional)"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="btn btnPrimary" type="submit">
          Add Product
        </button>
      </form>

      <h3>Products</h3>
      {!products.length ? (
        <p className="mutedText">No products available yet.</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="card cartRow">
            <span>{product.name}</span>
            <button className="btn btnDanger" onClick={() => deleteProduct(product._id)}>
              Delete
            </button>
          </div>
        ))
      )}

      <div className="statsGrid">
        <div className="card">
          <h3>Users</h3>
          <p className="price">{users.length}</p>
        </div>
        <div className="card">
          <h3>Orders</h3>
          <p className="price">{orders.length}</p>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
