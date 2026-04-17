import { useMemo, useState } from "react";
import api from "../api";

function CartPage({ user }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const checkout = async () => {
    if (!user) return alert("Please login first");
    try {
      await api.post("/orders", { items: cart.map(({ product, quantity }) => ({ product, quantity })) });
      localStorage.removeItem("cart");
      setCart([]);
      alert("Order placed successfully");
    } catch (error) {
      alert("Checkout failed");
    }
  };

  return (
    <section className="pageSection">
      <h2>Cart</h2>
      {!cart.length ? (
        <p className="mutedText">Your cart is empty. Add products to continue.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.product} className="card cartRow">
              <p>{item.name}</p>
              <p>
                {item.quantity} x ${item.price}
              </p>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button className="btn btnPrimary" onClick={checkout}>
            Checkout
          </button>
        </>
      )}
    </section>
  );
}

export default CartPage;
