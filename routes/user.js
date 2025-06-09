const express = require("express");
const router = express.Router();
const { getMe, deleteUser, updateUser } = require("../controllers/userController");


router.get("/me", getMe);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;


