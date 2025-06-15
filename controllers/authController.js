const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../schemas/authControllerSchema');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const register = async (req, res) => {
  try {
    const { user, password, email } = req.body;

    //validaciones
    const { error } = registerSchema.safeParse(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    //Leer usuarios existentes (antigua forma)
    // const usersPath = path.join(__dirname, '../data/users.json');
    // const usersData = await fs.readFile(usersPath, 'utf8');
    // const users = JSON.parse(usersData);

    //Leer usuarios existentes (nueva forma)
    //const users = await prisma.user.findMany(); 

    // Verificar si el usuario o email ya existen
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { user: user },
          { email: email }
        ]
      }
    });
    
    if (existingUser) {
      if (existingUser.user === user) {
        return res.status(400).json({ message: "El nombre de usuario ya está registrado" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
    }

    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear nuevo usuario (antigua forma)
    //const newUser = {
    //  id: users.length + 1,
      //user,
      //password: passwordHash,
      //email,
    //  createdAt: new Date().toISOString()
    //};

    // Crear nuevo usuario y guardar en la base de datos (nueva forma)
    const newUser = await prisma.user.create({
      data: {
        user,
        password: passwordHash,
        email,
        nickname: null
      }
    });

    // Agregar usuario al array y guardar (antigua forma)
    //users.push(newUser);
    //await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id,
        user: newUser.user,
        email: newUser.email,
        nickname: newUser.nickname
      }
    });

  } catch (error) {
    // Manejo específico de errores de Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return res.status(400).json({ 
        message: `El ${field} ya está registrado` 
      });
    }

    console.error('Error en el registro:', error);
    res.status(500).json({ 
      message: "Error al registrar el usuario",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { user, password } = req.body;

    //validaciones
    const { error } = loginSchema.safeParse(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Buscar usuario
    const userFound = await prisma.user.findFirst({
      where: {
        user: user
      }
    });

    if (!userFound) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, userFound.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: userFound.id, user: userFound.user },
      'secret_key', // En producción, usar process.env.JWT_SECRET
      { expiresIn: '1h' }
    );

    // Enviar token en cookie
    try {
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 3600000,
        path: '/',
      });
    } catch (cookieError) {
      console.error('Error al establecer la cookie:', cookieError);
      return res.status(500).json({ 
        message: "Error al establecer la sesión",
        error: process.env.NODE_ENV === 'development' ? cookieError.message : undefined
      });
    }

    res.json({
      message: "Login exitoso",
      user: { id: userFound.id, user: userFound.user, email: userFound.email }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ 
      message: "Error en el login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true en producción, false en desarrollo
      sameSite: 'lax',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : 'localhost'
    });

    res.status(200).json({ 
      message: 'Logout exitoso',
      success: true 
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ 
      message: 'Error al cerrar sesión',
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  logout
};





