# GreenWorld Payment System Setup Guide

This guide will help you set up the complete payment system for GreenWorld with PayPal and Cash on Delivery options.

## 🚀 Features Implemented

- **Cash on Delivery (COD)** - Traditional payment method
- **PayPal Integration** - Secure online payments
- **Order Management** - Complete order tracking system

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- PayPal Developer Account

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Update the following variables in your `.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/greenworld

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Stripe Configuration (removed - using PayPal only)
# STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
FRONTEND_ORIGIN=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. PayPal Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a new application
3. Get your Client ID and Client Secret
4. Update your `.env` file with these credentials

### 4. Stripe Setup (Removed)

Stripe integration has been removed. Only PayPal and Cash on Delivery are supported.

### 5. Start Backend Server

```bash
npm run dev
```

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory:

```bash
cp env.example .env
```

Update the following variables:

```env
# PayPal Configuration
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id

# Stripe Configuration (removed - using PayPal only)
# REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Server

```bash
npm start
```

## 🔄 Payment Flow

### Cash on Delivery (COD)
1. User selects COD payment method
2. Order is created with "Pending" status
3. Payment is collected upon delivery

### PayPal Payment
1. User selects PayPal payment method
2. PayPal order is created via API
3. User is redirected to PayPal for payment
4. Payment is captured via webhook or return URL
5. Order status is updated to "Paid"


## 📊 API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders` - Get all orders (admin)

### Payments
- `POST /api/payments/paypal/create` - Create PayPal order
- `POST /api/payments/paypal/capture` - Capture PayPal payment

### Webhooks
- `POST /api/webhooks` - Webhook endpoint (ready for PayPal webhooks)

## 🛡️ Security Features

- JWT authentication for all protected routes
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- MongoDB injection protection

## 🧪 Testing

### Test PayPal Payments
Use PayPal's sandbox environment with test accounts.


## 🚨 Troubleshooting

### Common Issues

1. **PayPal Integration Not Working**
   - Check if PayPal Client ID is correct
   - Ensure PayPal mode is set to "sandbox" for testing
   - Verify return URLs are configured


2. **CORS Issues**
   - Check FRONTEND_ORIGIN in backend .env
   - Ensure frontend URL matches the origin

3. **Database Connection Issues**
   - Verify MongoDB is running
   - Check MONGODB_URI in .env file

## 📝 Order Status Flow

1. **Pending** - Order created, payment not yet processed
2. **Paid** - Payment successful, order confirmed
3. **Failed** - Payment failed, order cancelled

## 🔧 Development Commands

```bash
# Backend
npm run dev          # Start development server
npm start           # Start production server

# Frontend
npm start           # Start development server
npm run build       # Build for production
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs for errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

## 🎯 Next Steps

- Add email notifications for order confirmations
- Implement order tracking system
- Add refund functionality
- Set up production environment
- Add analytics and reporting
