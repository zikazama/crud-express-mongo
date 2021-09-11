const tokenManager = require("./../helpers/tokenManager");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.model.js");
const User = require("../models/user.model.js");
const Authentication = require("../models/authentication.model.js");

async function login(req, res) {
  let foundUser = await Admin.findOne({ email: req.body.email });
  if (foundUser) {
    let submittedPass = req.body.password;
    let storedPass = foundUser.password;

    const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
    if (passwordMatch) {
      const payload = { id: foundUser.id, role: "admin" };

      const aToken = tokenManager.generateAccessToken(payload);
      const rToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

      let authUser = new Authentication({
        refreshToken: rToken,
      });

      authUser.save();

      res.json({
        AccessToken: aToken,
        RefreshToken: rToken,
        message: "You are logged-in",
      });
    } else {
      res.json({ message: "Invalid password" });
    }
  } else {
    res.json({ message: "Invalid email" });
  }
}

async function token(req, res) {
  const payload = req.payload;
  let token = await Authentication.findOne({ id: payload.id });
  if (!token.refreshToken) {
    res.json({ message: "Token Not Found" });
  }

  jwt.verify(
    token.refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, payload) => {
      if (err) {
        res.json({ message: err });
      } else {
        const accessToken = tokenManager.generateAccessToken({
          id: payload.id,
          role: 'admin'
        });

        res.json({
          AccessToken: accessToken,
          message: "This is your new access token",
        });
      }
    }
  );
}

async function deleteRefreshToken(req, res) {
  const payload = req.payload;
  let token = await Authentication.findOne({ id: payload.id });

  if (token == null) {
    res.json({ message: "Invalid access token" });
  } else {
    let tokenFound = await Authentication.findOne({ id: token });
    tokenFound.delete();
    //refreshTokensDB = refreshTokensDB.filter(data => data !== token);
    res.json({ message: "Refresh token deleted successfully" });
  }
}

async function createUser(req, res) {
  let foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    let hashPassword = await bcrypt.hash(req.body.password, 10);

    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    await newUser.save();

    res.json({ message: "User Have Been Created", data: newUser });
  } else {
    res.json({ message: "Email Already Registered" });
  }
}

async function readUser(req, res) {
  let foundUser = await User.find();

  if (foundUser.length > 0) {
    res.json({ message: "User Have Been Founded", data: foundUser });
  } else {
    res.json({ message: "User Empty" });
  }
}

async function readUserById(req, res) {
  let foundUser = await User.findById(req.params.userId);
  if (foundUser) {
    res.json({ message: "User Have Been Founded", data: foundUser });
  } else {
    res.json({ message: "User Not Found" });
  }
}

async function updateUser(req, res) {
  let foundUser = await User.findById(req.params.userId);
  if (foundUser) {
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: hashPassword,
        },
      }
    );
    foundUser = await User.findById(req.params.userId);
    res.json({ message: "User Have Been Update", data: foundUser });
  } else {
    res.json({ message: "User Not Found" });
  }
}

async function deleteUser(req, res) {
  let foundUser = await User.findById(req.params.userId);
  if (foundUser) {
    await User.deleteOne({ id: req.params.userId });
    res.json({ message: "User Have Been Deleted", data: foundUser });
  } else {
    res.json({ message: "User Not Found" });
  }
}

module.exports = {
  login,
  deleteRefreshToken,
  token,
  createUser,
  readUser,
  readUserById,
  updateUser,
  deleteUser,
};
