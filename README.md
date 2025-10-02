 ---- GreenWorld – E-Commerce App ----

Full-stack Plant E-Commerce platform built with:

Backend: Node.js, Express.js, MongoDB (Mongoose)

Frontend: React + TailwindCSS

Payment: PayPal / Cash on Delivery



 1. Configuration
Backend – .env file

Create a .env file inside /backend folder:

# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/greenworld

# JWT Secret
JWT_SECRET=your_strong_secret_key

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox   # or live



Frontend – .env file

Create a .env file inside /frontend folder:

REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id



 2. Database Setup
MongoDB

Make sure you have a MongoDB cluster running (Atlas or local).
To create a database and collections:

use greenworld;

db.createCollection("users");
db.createCollection("products");
db.createCollection("orders");
db.createCollection("categories");

 2.1 Seeding Data

Create a file /backend/seeder.js:

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const seedData = async () => {
  try {
    // Clear existing
    await User.deleteMany();
    await Product.deleteMany();

    // Create admin user
    const adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@greenworld.com",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin",
    });

    // Create sample users
    const users = await User.insertMany([
      {
        fullName: "John Doe",
        email: "john@example.com",
        password: bcrypt.hashSync("123456", 10),
      },
      {
        fullName: "Jane Smith",
        email: "jane@example.com",
        password: bcrypt.hashSync("123456", 10),
      },
    ]);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: "Aloe Vera Plant",
        price: 15.99,
        description: "Air purifying indoor plant.",
        stock: 50,
        category: "Indoor",
      },
      {
        name: "Snake Plant",
        price: 22.5,
        description: "Low maintenance plant for home/office.",
        stock: 40,
        category: "Indoor",
      },
      {
        name: "Basil",
        price: 5.0,
        description: "Fresh organic basil plant.",
        stock: 100,
        category: "Herbs",
      },
    ]);

    console.log(" Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(" Seeding error:", err);
    process.exit(1);
  }
};

seedData();

Run Seeder
cd backend
node seeder.js


This will:

Add 1 admin user (email: admin@greenworld.com, pass: admin123)

Add 2 sample users

Add 3 products (Aloe Vera, Snake Plant, Basil)




 3. Run the Application
Backend (Node.js + Express)
cd backend
npm install
npm run dev   # uses nodemon

Frontend (React)
cd frontend
npm install
npm start


The app will be available at:

Backend API: http://localhost:5000

Frontend UI: http://localhost:3000




 4. Deployment
Node.js Backend

1.Build frontend (npm run build inside /frontend)

2.Copy /frontend/build into backend’s public folder or serve with Express.

3.Run backend on production server:
    NODE_ENV=production PORT=5000 node server.js

4.Use PM2 for process management:
    pm2 start server.js --name greenworld
    pm2 startup
    pm2 save


HTTPS Setup (NGINX + Certbot)

1.Point domain to server IP.
2.Install NGINX & Certbot.
3.Configure reverse proxy:

server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}


4.Enable SSL with Let’s Encrypt:

sudo certbot --nginx -d yourdomain.com



Optional: Spring Boot / Tomcat Deployment

If you later switch to Spring Boot backend:

Use application.properties instead of .env

server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/greenworld
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update


Run with:
    mvn spring-boot:run

Deploy .war to Tomcat by copying it into /webapps.


{Now you can configure, seed, run, and deploy GreenWorld easily}