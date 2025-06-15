const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    // Patrones de URL permitidos
    const allowedPatterns = [
      /^https:\/\/ecommerce-refactor-tzah\.vercel\.app$/, // producción
      /^https:\/\/ecommerce-refactor-tzah-.*\.vercel\.app$/, // previews
      /^http:\/\/localhost:3000$/, // desarrollo local
    ];

    // Verificar si el origen coincide con algún patrón
    const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "credentials"],
};

app.use(cors(corsOptions));
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
