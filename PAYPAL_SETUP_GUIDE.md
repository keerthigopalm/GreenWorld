# PayPal Integration Setup Guide

## 🚀 Quick Setup

### 1. Get PayPal Sandbox Credentials

1. **Go to PayPal Developer Dashboard**: https://developer.paypal.com/
2. **Sign in** with your PayPal account
3. **Create a new app**:
   - Click "Create App"
   - Choose "Default Application"
   - Select "Sandbox" environment
   - Click "Create App"

4. **Copy your credentials**:
   - **Client ID**: Copy the "Client ID" from your app
   - **Client Secret**: Click "Show" next to "Client Secret" and copy it

### 2. Configure Backend (.env)

Create or update `backend/.env`:

```env
# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret_here
PAYPAL_MODE=sandbox

# Other required variables...
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Configure Frontend (.env)

Create or update `frontend/.env`:

```env
# PayPal Configuration (Sandbox)
REACT_APP_PAYPAL_CLIENT_ID=your_sandbox_client_id_here

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Test PayPal Integration

1. **Start the servers**:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm start
   ```

2. **Test the flow**:
   - Add items to cart
   - Go to checkout
   - Select PayPal payment
   - You should see real PayPal buttons (not mock mode)

## 🔧 How It Works

### Hybrid PayPal System

The system automatically detects if PayPal credentials are configured:

- **✅ Real PayPal**: If `REACT_APP_PAYPAL_CLIENT_ID` is set, shows real PayPal buttons
- **🔄 Mock Mode**: If no client ID, falls back to mock PayPal for testing

### Backend Flow

1. **Order Creation**: Creates order in database
2. **PayPal Order**: Creates real PayPal order via API
3. **Payment Capture**: Captures payment when user approves
4. **Fallback**: If PayPal fails, uses mock mode

### Frontend Flow

1. **Real PayPal**: Uses PayPal SDK buttons for real payments
2. **Mock PayPal**: Uses custom button for testing
3. **Error Handling**: Graceful fallback to mock mode

## 🧪 Testing

### Sandbox Testing

1. **Use PayPal Sandbox**: https://www.sandbox.paypal.com/
2. **Test Accounts**: PayPal provides test buyer/seller accounts
3. **Test Cards**: Use PayPal's test credit cards

### Mock Mode Testing

- Works without PayPal credentials
- Simulates complete payment flow
- Perfect for development and testing

## 🚀 Production Setup

### 1. Get Live PayPal Credentials

1. **Go to PayPal Developer Dashboard**
2. **Create Live App** (not sandbox)
3. **Copy Live Credentials**

### 2. Update Environment Variables

**Backend (.env)**:
```env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_MODE=live
```

**Frontend (.env)**:
```env
REACT_APP_PAYPAL_CLIENT_ID=your_live_client_id
```

### 3. Deploy

- Update your production environment variables
- Deploy both frontend and backend
- Test with real PayPal accounts

## 🔍 Troubleshooting

### Common Issues

1. **"PayPal not configured"**: Set `REACT_APP_PAYPAL_CLIENT_ID`
2. **"INVALID_RESOURCE_ID"**: Check PayPal credentials
3. **"PayPal API error"**: Verify sandbox credentials
4. **Mock mode always shows**: Check environment variables

### Debug Steps

1. **Check console logs** for PayPal API responses
2. **Verify credentials** in PayPal Developer Dashboard
3. **Test with sandbox** accounts first
4. **Check network requests** in browser dev tools

## 📚 PayPal Documentation

- **PayPal Developer Docs**: https://developer.paypal.com/docs/
- **Checkout SDK**: https://developer.paypal.com/docs/checkout/
- **Sandbox Testing**: https://developer.paypal.com/docs/api-basics/sandbox/

## 🎯 Current Status

✅ **Backend**: Real PayPal API integration with fallback
✅ **Frontend**: Hybrid PayPal/Mock system
✅ **Error Handling**: Graceful fallbacks
✅ **Testing**: Both real and mock modes available

**Ready for production!** Just add your PayPal credentials and deploy.
