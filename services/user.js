const tokenManager = require("./../helpers/tokenManager");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../models/user.model.js');
const Authentication = require('../models/authentication.model.js');

async function register(req, res) {
  let foundUser = await User.findOne({email:req.body.email});
  if (!foundUser) {
    let hashPassword = await bcrypt.hash(req.body.password, 10);

    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    await newUser.save();

    res.json({ message: "Registration successful" });
  } else {
    res.json({ message: "Email Already Registered" });
  }
}

async function profile(req, res) {
  let payload = req.payload;
  let foundUser = await User.findById(payload.id);

  res.json({
    user: foundUser,
    message: "This is your profile data",
  });
}

async function login(req, res) {
  let foundUser = await User.findOne({email:req.body.email});
  if (foundUser) {
    let submittedPass = req.body.password;
    let storedPass = foundUser.password;

    const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
    if (passwordMatch) {
      const payload = { id: foundUser.id, role:'user' };

      const aToken = tokenManager.generateAccessToken(payload);
      const rToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

      let authUser = new Authentication({
        refreshToken:rToken
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
  let token = await Authentication.findOne({id:payload.id});
  if (!token.refreshToken) {
    res.json({ message: "Token Not Found" });
  }

  jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
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
  });
}

async function deleteRefreshToken(req, res) {
  const payload = req.payload;
  let token = await Authentication.findOne({id:payload.id});

  if (token == null) {
    res.json({ message: "Invalid access token" });
  } else {
    let tokenFound = await Authentication.findOne({id:token});
    tokenFound.delete();
    //refreshTokensDB = refreshTokensDB.filter(data => data !== token);
    res.json({ message: "Refresh token deleted successfully" });
  }
}

module.exports = { register, login, token, deleteRefreshToken, profile };
