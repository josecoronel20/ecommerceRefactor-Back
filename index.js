const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Permitir origenes autorizados
const allowedOrigins = [
  "https://ecommerce-refactor-tzah.vercel.app", // producción
  "https://ecommerce-refactor-tzah-ipamhyvn7-josecoronel20s-projects.vercel.app", // preview
  "http://localhost:3000", // desarrollo local
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
