import React, { useState, useEffect } from "react";
import API from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders/myorders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          alert("Please log in to view your orders");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 bg-white shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Order #{order.orderID}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">LKR {order.totalAmount}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : order.paymentStatus === 'Failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p className="text-sm">
                  <strong>Items:</strong> {order.items.length} item(s)
                </p>
              </div>

              <div className="border-t pt-2">
                <h4 className="font-medium mb-1">Items:</h4>
                <ul className="text-sm space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>LKR {item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
