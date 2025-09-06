import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import fs from "fs";
import https from "https";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js"; 
import meRoutes from "./routes/meRoutes.js";
import passport from "./config/passport.js";
import orderRoutes from "./routes/orderRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";



dotenv.config();
connectDB();

const app = express();

// —— Security middleware (OWASP) ——
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,  // "http://localhost:3000"
    credentials: true, //  allow cookies/credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(express.json({ limit: "1mb" })); // body parser

// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//     checkBody: true,    // sanitize POST/PUT body
//     checkQuery: false,  // ❌ do NOT touch GET query
//     checkParams: true ,  // sanitize route params
//    // onSanitize: ({ req, key }) => console.log(`Sanitized field: ${key}`)

//   })
// );
              
app.use(cookieParser());

// —— Routes ——
app.use(passport.initialize());
app.use("/api/auth", authRoutes);             // keep your local email/pass if you want
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes); 
app.use("/api/orders", orderRoutes);   
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use("/api", meRoutes);

app.get("/", (_req, res) => res.send("GreenWorld API up"));


const PORT = process.env.PORT || 5000;

if (process.env.USE_HTTPS === "true") {
  const key = fs.readFileSync(process.env.SSL_KEY_PATH);
  const cert = fs.readFileSync(process.env.SSL_CERT_PATH);
  https.createServer({ key, cert }, app).listen(PORT, () =>
    console.log(`HTTPS server on ${PORT}`)
  );
} else {
  app.listen(PORT, () => console.log(`HTTP server on ${PORT}`));
}
