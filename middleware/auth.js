const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Obtener token de la cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, 'tu_secreto_jwt');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = authMiddleware; 