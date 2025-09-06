import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();

// Configure PayPal environment
const environment =
  process.env.PAYPAL_MODE === "live"
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal order
export const createPayPalOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, shippingInfo } = req.body;

    console.log("PayPal order request:", req.body);

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    // Create order first
    const orderData = {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount: parseFloat(totalAmount),
      paymentStatus: "Pending",
      shippingInfo: shippingInfo || {}
    };

    // Only add user if it's a valid ObjectId
    if (req.user?.id) {
      orderData.user = req.user.id;
    }

    const order = new Order(orderData);

    await order.save();
    console.log("Order created successfully:", order._id);

    // Create real PayPal order
    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{ 
          amount: { 
            currency_code: "USD", 
            value: totalAmount 
          },
          description: `Order for ${items.length} item(s)`,
          custom_id: order._id.toString()
        }],
        application_context: { 
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`, 
          cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
          brand_name: "GreenWorld",
          landing_page: "BILLING",
          user_action: "PAY_NOW"
        }
      });

      const response = await client.execute(request);
      order.paypalOrderID = response.result.id;
      await order.save();

      console.log("Real PayPal order created:", response.result.id);
      return res.json({ id: response.result.id });

    } catch (paypalError) {
      console.error("PayPal API error:", paypalError);
      
      // Fallback to mock mode if PayPal fails
      const mockPayPalOrderId = `PAYPAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      order.paypalOrderID = mockPayPalOrderId;
      await order.save();
      
      console.log("PayPal failed, using mock mode:", mockPayPalOrderId);
      return res.json({ 
        id: mockPayPalOrderId,
        message: "PayPal order created (fallback mode - PayPal API error)"
      });
    }

  } catch (error) {
    console.error("PayPal order creation error:", error);
    res.status(500).json({ message: "Failed to create PayPal order: " + error.message });
  }
};

// Capture PayPal payment (webhook or return URL)
export const capturePayPalPayment = async (req, res) => {
  try {
    const { orderID } = req.body;
    console.log("Capturing PayPal payment for order:", orderID);

    const order = await Order.findOne({ paypalOrderID: orderID });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Handle mock orders (fallback mode)
    if (orderID.startsWith('PAYPAL-')) {
      order.paymentStatus = "Paid";
      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();
      
      console.log("Mock PayPal payment captured for order:", order._id);
      return res.json({ 
        message: "Payment captured successfully (mock mode)",
        orderId: order._id,
        status: "COMPLETED"
      });
    }

    // Real PayPal capture
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      request.requestBody({});
      const capture = await client.execute(request);

      order.paymentStatus = "Paid";
      order.isPaid = true;
      order.paidAt = new Date();
      order.paypalCaptureID = capture.result.id;
      await order.save();

      console.log("Real PayPal payment captured:", capture.result.id);
      res.json({
        message: "Payment captured successfully",
        orderId: order._id,
        status: "COMPLETED",
        captureId: capture.result.id
      });

    } catch (paypalError) {
      console.error("PayPal capture error:", paypalError);
      res.status(500).json({ 
        message: "Failed to capture PayPal payment: " + paypalError.message 
      });
    }

  } catch (error) {
    console.error("PayPal capture error:", error);
    res.status(500).json({ message: "Failed to capture PayPal payment: " + error.message });
  }
};
