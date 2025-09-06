import Order from "../models/Order.js";
import dotenv from "dotenv";
import paypal from "@paypal/checkout-server-sdk";

dotenv.config();

// Setup PayPal environment
const environment =
  process.env.PAYPAL_MODE === "live"
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );

const paypalClient = new paypal.core.PayPalHttpClient(environment);

// ---------------------------------------------------
// Create Order (COD or PayPal)
// ---------------------------------------------------
export const createOrder = async (req, res) => {
  const { items, totalPrice, shippingInfo, paymentMethod } = req.body;

  try {
    console.log("Order creation request:", req.body);

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate items have required fields
    for (let item of items) {
      if (!item.quantity || !item.price) {
        return res.status(400).json({ 
          message: `Item ${item.name || 'unknown'} is missing quantity or price` 
        });
      }
    }

    // Create new order
    let order = new Order({
      user: req.user.id,
      items,
      shippingAddress: shippingInfo,
      totalAmount: totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
    });

    // PayPal payment
    if (paymentMethod === "PayPal") {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalPrice.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "GreenWorld",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.FRONTEND_URL}/paypal-success`,
          cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        },
      });

      const response = await paypalClient.execute(request);
      order.paypalOrderID = response.result.id;
      await order.save();

      return res.status(201).json({
        orderId: order._id,
        approvalUrl: response.result.links.find((link) => link.rel === "approve").href,
      });
    }

    // COD flow
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------
// Capture PayPal Payment
// ---------------------------------------------------
export const capturePayPalPayment = async (req, res) => {
  const { orderId, paypalOrderID } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderID);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "Paid";
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paypalCaptureID = capture.result.id;

    await order.save();
    res.json({ message: "✅ Payment captured successfully", order });
  } catch (err) {
    console.error("❌ Error capturing PayPal payment:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------
// User Orders
// ---------------------------------------------------
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------
// Admin: All Orders
// ---------------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "fullName email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
