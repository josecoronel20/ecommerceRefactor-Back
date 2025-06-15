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

    // Verificar si el usuario existe antes de eliminarlo
    const userExists = await prisma.user.findUnique({
      where: { id: idNumber },
    });

    if (!userExists) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: idNumber },
    });

    // Limpiar la cookie después de eliminar el usuario
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 0,
      path: "/",
    });

    // Enviar respuesta exitosa
    return res.status(200).json({
      message: "Usuario eliminado correctamente",
      success: true,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    // Manejo específico de errores de Prisma
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Usuario no encontrado",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Error al eliminar el usuario",
      success: false,
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
        ...(purchases && purchases.length > 0
          ? {
              purchases: {
                create: purchases.map((purchase) => {
                  const { id: purchaseId, userId, ...purchaseData } = purchase;
                  return purchaseData;
                }),
              },
            }
          : {}),
      },
      include: {
        purchases: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error detallado al actualizar usuario:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
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
    } //

    try {
      const decoded = jwt.verify(token, "secret_key");
      const idFromToken = decoded.id;

      const user = await prisma.user.findUnique({
        where: {
          id: idFromToken,
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
              products: true,
            },
          },
        },
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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  deleteUser,
  updateUser,
  getMe,
};
