# Node.js Authentication API Documentation

# Base URL

```txt
http://localhost:5000/api/auth
```

---

# 1. Register User

## Route

```http
POST /register
```

## Full URL

```txt
http://localhost:5000/api/auth/register
```

## Request Body

```json
{
  "name": "Vikash",
  "email": "vikash@gmail.com",
  "password": "123456"
}
```

## Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "689d7f9f7c0f2a1234567890",
      "name": "Vikash",
      "email": "vikash@gmail.com",
      "role": "user",
      "createdAt": "2025-05-28T10:00:00.000Z",
      "updatedAt": "2025-05-28T10:00:00.000Z"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

# 2. Login User

## Route

```http
POST /login
```

## Full URL

```txt
http://localhost:5000/api/auth/login
```

## Request Body

```json
{
  "email": "vikash@gmail.com",
  "password": "123456"
}
```

## Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "689d7f9f7c0f2a1234567890",
      "name": "Vikash",
      "email": "vikash@gmail.com",
      "role": "user"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

# 3. Get Profile

## Route

```http
GET /profile
```

## Full URL

```txt
http://localhost:5000/api/auth/profile
```

## Headers

```txt
Authorization: Bearer YOUR_TOKEN
```

Example:

```txt
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

## Success Response

```json
{
  "success": true,
  "user": {
    "_id": "689d7f9f7c0f2a1234567890",
    "name": "Vikash",
    "email": "vikash@gmail.com",
    "role": "user",
    "createdAt": "2025-05-28T10:00:00.000Z",
    "updatedAt": "2025-05-28T10:00:00.000Z"
  }
}
```

---

# Auth Routes File

## src/routes/auth.routes.js

```js
const express = require("express");

const {
  register,
  login,
  profile,
} = require("../controllers/auth.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, profile);

module.exports = router;
```

---

# Controller File

## src/controllers/auth.controller.js

```js
const {
  registerUser,
  loginUser,
} = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const data = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const profile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  profile,
};
```

---

# Middleware File

## src/middleware/auth.middleware.js

```js
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = protect;
```

---

# User Model

## src/models/User.js

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
```

---

# Test Order in Postman

## 1. Register

```txt
POST /api/auth/register
```

## 2. Login

Copy JWT token.

## 3. Profile

Add token in Bearer Token authorization.

