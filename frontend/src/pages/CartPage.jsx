import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../api";

function CartPage({ user }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const checkout = async () => {
    if (!user) {
      toast.info("Please login first");
      return;
    }
    try {
      await api.post("/orders", { items: cart.map(({ product, quantity }) => ({ product, quantity })) });
      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Order placed successfully");
    } catch (error) {
      toast.error("Checkout failed");
    }
  };

  return (
    <section className="pageSection">
      <h2>Cart</h2>
      {!cart.length ? (
        <div className="card cartEmptyCard">
          <h3>Your cart is empty</h3>
          <p className="mutedText">Add products to continue shopping and checkout.</p>
        </div>
      ) : (
        <div className="cartLayout">
          <div className="cartItemsWrap">
            {cart.map((item) => (
              <div key={item.product} className="card cartItemCard">
                <div>
                  <p className="cartItemName">{item.name}</p>
                  <p className="mutedText">
                    Unit price: ${item.price} | Qty: {item.quantity}
                  </p>
                </div>
                <p className="price">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <aside className="card cartSummaryCard">
            <p className="mutedText">Order Summary</p>
            <h3>Total: ${total.toFixed(2)}</h3>
            <p className="mutedText">Taxes and shipping are included in this demo checkout.</p>
            <button className="btn btnPrimary cartCheckoutBtn" onClick={checkout}>
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartPage;
