const z = require('zod');
const { userValidation, emailValidation, passwordValidation, idValidation } = require('./validations');

const registerSchema = z.object({
    user: userValidation,
    email: emailValidation,
    password: passwordValidation,
  });
  
const loginSchema = z.object({
    user: userValidation,
    password: passwordValidation,
  });

module.exports = {
  registerSchema,
  loginSchema
};

