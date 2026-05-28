const express = require("express");
const protect = require("../middleware/auth.middleware");
const { register, login, profile } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, profile);

module.exports = router;
