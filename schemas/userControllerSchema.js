const z = require('zod');
const { idValidation, userValidation, emailValidation, passwordValidation } = require('./validations');

const deleteUserSchema = z.object({
  id: idValidation,
});

const updateUserSchema = z.object({
  id: idValidation,
  user: userValidation,
  email: emailValidation,
  password: passwordValidation
});

const getMeSchema = z.object({
  id: idValidation,
});

module.exports = {
  deleteUserSchema,
  updateUserSchema,
  getMeSchema
};

