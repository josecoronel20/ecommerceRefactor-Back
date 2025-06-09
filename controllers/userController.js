const jwt = require("jsonwebtoken");
const { deleteUserSchema } = require("../schemas/userControllerSchema");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const idNumber = parseInt(id);

    const { error } = deleteUserSchema.safeParse({ id: idNumber });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Nueva forma de eliminar usuario
    const userFounded = await prisma.user.delete({
      where: { id: idNumber }
    });

    if (!userFounded) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = req.body;
    const { id } = req.params;
    const idNumber = parseInt(id);

    // Extraemos el id del body para no actualizarlo
    const { id: bodyId, purchases, ...userData } = user;

    // Nueva forma de actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: idNumber },
      data: {
        ...userData,
        // Solo creamos nuevas compras si se proporcionan
        ...(purchases && purchases.length > 0 ? {
          purchases: {
            create: purchases.map(purchase => {
              const { id: purchaseId, userId, ...purchaseData } = purchase;
              return purchaseData;
            })
          }
        } : {})
      },
      include: {
        purchases: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error detallado al actualizar usuario:", {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({
      message: "Error al actualizar el usuario",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "El usuario no está logueado" });
    }

    try {
      const decoded = jwt.verify(token, "secret_key");
      const idFromToken = decoded.id;

      const user = await prisma.user.findUnique({
        where: {
          id: idFromToken
        },
        select: {
          id: true,
          user: true,
          email: true,
          nickname: true,
          purchases: {
            select: {
              id: true,
              date: true,
              total: true,
              products: true
            }
          }
        }
      });

      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ user });
    } catch (jwtError) {
      console.error("Error al verificar token:", jwtError);
      return res.status(401).json({ message: "Token inválido" });
    }
  } catch (error) {
    console.error("Error completo en getMe:", error);
    res.status(500).json({ 
      message: "Error al obtener el usuario",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

module.exports = {
  deleteUser,
  updateUser,
  getMe,
};
