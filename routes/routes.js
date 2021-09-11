const express = require("express");
const router = express.Router();
const userService = require("./../services/user");
const adminService = require("./../services/admin");
const { authAccessUser, authAccessAdmin, authRefresh } = require("./../middleware/Auth");

// Route For Admin
router.post("/admin/login", async (req, res) => {
  try {
    adminService.login(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

router.post("/admin/token", authRefresh, (req, res) => {
  userService.token(req, res);
});

router.delete("/admin/logout", authRefresh, (req, res) => {
  adminService.deleteRefreshToken(req, res);
});

router.post("/user",authAccessAdmin, async (req, res) => {
  try {
    adminService.createUser(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

router.get("/user",authAccessAdmin, async (req, res) => {
  try {
    adminService.readUser(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

router.get("/user/:userId",authAccessAdmin, async (req, res) => {
  try {
    adminService.readUserById(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

router.put("/user/:userId",authAccessAdmin, async (req, res) => {
  try {
    adminService.updateUser(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

router.delete("/user/:userId",authAccessAdmin, async (req, res) => {
  try {
    adminService.deleteUser(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

////////////////////////////////////////////////////////////

// Route For User

// This endpoint will register new user
router.post("/register", async (req, res) => {
  try {
    userService.register(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

// '/login' route will authenticate the user
// and only after successful authentication,
// it will send access and refresh tokens
router.post("/login", async (req, res) => {
  try {
    userService.login(req, res);
  } catch (err) {
    res.json({ message: "Internal server error" });
  }
});

router.post("/profile", authAccessUser, (req, res) => {
  userService.profile(req, res);
});

// '/token' endpoint will accept the refresh token to generate new access token
router.post("/token", authRefresh, (req, res) => {
  userService.token(req, res);
});

// '/delRefreshToken' endpoint will be used by the legitimate client
// to delete the refresh token when his/her access token is compromised/stolen.
// This endpoint will accept the Refresh token and delete it from the database.
router.delete("/logout", authRefresh, (req, res) => {
  userService.deleteRefreshToken(req, res);
});

module.exports = router;
