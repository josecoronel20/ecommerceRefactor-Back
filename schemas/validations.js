const z = require('zod');

// Validaciones comunes para usuario
const userValidation = z
  .string()
  .min(1, 'El usuario es requerido')
  .min(3, 'El usuario debe tener al menos 3 caracteres')
  .max(20, 'El usuario no puede tener más de 20 caracteres')
  .regex(/^[a-zA-Z0-9_]+$/, 'El usuario solo puede contener letras, números y guiones bajos');

// Validaciones comunes para email
const emailValidation = z
  .string()
  .email('El email no es válido');

// Validaciones comunes para contraseña
const passwordValidation = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(50, 'La contraseña no puede tener más de 50 caracteres');

// Validaciones comunes para ID
const idValidation = z
  .number()
  .int('El ID debe ser un número entero')
  .positive('El ID debe ser un número positivo');

module.exports = {
  userValidation,
  emailValidation,
  passwordValidation,
  idValidation
}; 