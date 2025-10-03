import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import API from "../api/api";
import { useCart } from "../context/CartContext";


function CheckoutForm() {
  const { items, clear, total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const [paypalError, setPaypalError] = useState(false);
  const navigate = useNavigate();
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    deliveryDate: "",
    deliveryTime: "",
  });
  const [shipping, setShipping] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // simple flat rate logic: domestic vs international
    const domesticCountries = ["Sri Lanka", "LK"];
    const isDomestic = domesticCountries.includes(form.country);
    setShipping(isDomestic ? 5 : 20);
  }, [form.country]);

  useEffect(() => {
    if (paymentMethod === "PayPal" && !paypalClientId) {
      setPaypalError(true);
    } else {
      setPaypalError(false);
    }
  }, [paymentMethod, paypalClientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date(form.deliveryDate);
    if (date.getDay() === 0) { alert("⚠️ We don't deliver on Sundays."); return; }

    // Debug: Check if cart is empty
    if (!items || items.length === 0) {
      alert("Your cart is empty! Please add some items first.");
      return;
    }

    console.log("Checkout data:", { items, total, shipping, form });

    try {
      setSubmitting(true);
      if (paymentMethod === "COD") {
        // Create order without card payment
        await API.post("/orders", {
          items: items.map(i => ({ 
            productID: i.productID, 
            name: i.name, 
            quantity: i.quantity, 
            price: i.price 
          })),
          shippingAddress: { 
            street: form.address,
            city: form.city,
            country: form.country,
            postalCode: form.postalCode
          },
          paymentMethod: "COD",
          totalPrice: total + shipping,
          shippingInfo: {
            deliveryDate: form.deliveryDate,
            deliveryTime: form.deliveryTime
          }
        });
        clear();
        alert("Order placed with Cash on Delivery!");
        navigate("/");
        return;
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || err.message || "Request failed";
      if (status === 401) {
        alert("Your session expired. Please log in again.");
        navigate("/login", { replace: true });
      } else {
        alert(message);
      }
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          value={form.fullName}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          required
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input name="city" placeholder="City" className="border rounded p-2" value={form.city} onChange={handleChange} required />
          <input name="country" placeholder="Country (e.g., Sri Lanka)" className="border rounded p-2" value={form.country} onChange={handleChange} required />
          <input name="postalCode" placeholder="Postal Code" className="border rounded p-2" value={form.postalCode} onChange={handleChange} required />
        </div>
        <input
          type="date"
          name="deliveryDate"
          required
          value={form.deliveryDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <select
          name="deliveryTime"
          required
          value={form.deliveryTime}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Choose Delivery Time</option>
          <option value="morning">Morning (9AM - 12PM)</option>
          <option value="afternoon">Afternoon (1PM - 5PM)</option>
          <option value="evening">Evening (6PM - 9PM)</option>
        </select>
        <div className="space-y-2">
          <label className="block font-semibold">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="pm" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="pm" checked={paymentMethod === "PayPal"} onChange={() => setPaymentMethod("PayPal")} />
              PayPal
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center font-semibold">
          <span>Total</span>
          <span>${Number.isFinite(total + shipping) ? (total + shipping).toFixed(2) : "0.00"}</span>
        </div>
        {paymentMethod === "PayPal" && (
          <div className="border rounded p-3">
            {paypalError ? (
              // Fallback to mock mode when PayPal client ID is not configured
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Mock PayPal Mode:</strong> PayPal client ID not configured. Using mock mode for testing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setSubmitting(true);
                      
                      // Create PayPal order
                      const orderResponse = await API.post("/payments/paypal/create", {
                        items: items.map(i => ({
                          productID: i.productID,
                          name: i.name,
                          quantity: i.quantity,
                          price: i.price
                        })),
                        shippingAddress: { 
                          street: form.address,
                          city: form.city,
                          country: form.country,
                          postalCode: form.postalCode
                        },
                        paymentMethod: "PayPal",
                        shippingInfo: {
                          deliveryDate: form.deliveryDate,
                          deliveryTime: form.deliveryTime
                        }
                      });

                      const orderID = orderResponse.data.id;
                      console.log("PayPal order created:", orderID);

                      // Capture the payment
                      const captureResponse = await API.post("/payments/paypal/capture", { 
                        orderID: orderID 
                      });

                      console.log("Payment captured:", captureResponse.data);
                      
                      clear();
                      alert("Payment successful! Order placed successfully.");
                      navigate("/");
                    } catch (err) {
                      console.error("PayPal payment error:", err);
                      const msg = err?.response?.data?.message || err.message || "Failed to process PayPal payment";
                      alert(msg);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 1-.443-.272c-.365-.265-.596-.434-.596-.434s.23.169.596.434a3.35 3.35 0 0 1 .443.272c.365.265.596.434.596.434s-.23-.169-.596-.434z"/>
                      </svg>
                      <span>Pay with PayPal (Mock)</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Real PayPal integration
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async () => {
                  try {
                    const res = await API.post("/payments/paypal/create", {
                      items: items.map(i => ({ 
                        productID: i.productID,
                        name: i.name, 
                        price: i.price, 
                        quantity: i.quantity 
                      })),
                      shippingAddress: { 
                        street: form.address,
                        city: form.city,
                        country: form.country,
                        postalCode: form.postalCode
                      },
                      paymentMethod: "PayPal",
                      shippingInfo: {
                        deliveryDate: form.deliveryDate,
                        deliveryTime: form.deliveryTime
                      }
                    });
                    return res.data.id;
                  } catch (err) {
                    const msg = err?.response?.data?.message || err.message || "Failed to create PayPal order";
                    alert(msg);
                    throw err;
                  }
                }}
                onApprove={async (data) => {
                  try {
                    const response = await API.post("/payments/paypal/capture", { orderID: data.orderID });
                    clear();
                    alert("Payment successful! Order placed successfully.");
                    navigate("/");
                  } catch (err) {
                    const msg = err?.response?.data?.message || err.message || "Failed to capture PayPal order";
                    alert(msg);
                  }
                }}
                onError={(err) => {
                  const msg = (typeof err === "string" ? err : err?.message) || "PayPal script error";
                  alert(msg);
                }}
              />
            )}
          </div>
        )}

        <button disabled={submitting} type="submit" className="w-full bg-slate-800 text-white p-2 rounded">
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default function Checkout() { return <CheckoutForm />; }
