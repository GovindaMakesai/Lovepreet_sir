import { Link, NavLink, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brandWrap">
          <Link to="/" className="brand">
            AI Shop
          </Link>
          <span className="subtle">Smart recommendations and price insights</span>
        </div>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          {user?.role === "admin" && <NavLink to="/dashboard">Dashboard</NavLink>}
        </nav>
        <div className="authArea">
          {user ? (
            <>
              <span className="welcomeText">Hi, {user.name}</span>
              <button className="btn btnGhost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btnPrimary">
              Login / Register
            </Link>
          )}
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage user={user} />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/dashboard" element={<AdminDashboardPage user={user} />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2200} hideProgressBar={false} />
    </div>
  );
}

export default App;
