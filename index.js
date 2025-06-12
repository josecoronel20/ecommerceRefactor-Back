const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

//routes
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(
  cors({
    origin: ["https://ecommerce-refactor-tzah.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
  })
);

app.use(express.json());
app.use(cookieParser());

// productos
app.use("/api/products", productsRoutes);

// auth
app.use("/api/auth", authRoutes);

// user
app.use("/api/user", userRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
