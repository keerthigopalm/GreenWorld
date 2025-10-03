import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  // Handle quantity change
  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQty);
  };


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-white shadow p-4 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{item.name}</span>
                <div className="flex items-center mt-1">
                  <input
                    type="number"
                    value={item.qty || 1} // ✅ default to 1
                    min="1"
                    className="border p-1 w-16 mx-2"
                    onChange={(e) =>
                      handleQtyChange(item._id, Number(e.target.value) || 1) // ✅ ensure number
                    }
                  />
                </div>
              </div>

              <span className="font-semibold">
                LKR {(item.price || 0) * (item.qty || 1)}
              </span>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 font-semibold ml-4"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <>
          <div className="mt-6 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>LKR {total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
