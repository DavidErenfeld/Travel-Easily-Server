const express = require("express");
const router = express.Router();
const User = require("../controllers/users_controller");

router.get("/", User.getAllUsers);

router.get("/:id", User.getUserById);

router.post("/", User.postUser);

router.put("/:id", User.putUserById);

router.delete("/:id", User.deleteUserById);

module.exports = router;
