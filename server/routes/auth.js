const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { bcryptSaltLength } = require("../config/config");
const User = require("../schemas/User");
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middleware/auth");

const router = express.Router();

const handleLogin = (req, res) => {
  passport.authenticate("local", (err, user, message) => {
    if (err) {
      res.status(401).json({
        authenticated: false,
        user: null,
      });
    }
    if (message) console.log(message);
    req.logIn(user, (error) => {
      if (error) {
        req.sendStatus(500);
        return;
      }
      res.json({
        authenticated: true,
        user,
      });
    });
  })(req, res);
};

const handleRegister = async (req, res, next) => {
  console.log("Attempting to register user: ", req.body);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.sendStatus(401);
      return;
    }
    const hashedPassword = await bcrypt.hash(password, bcryptSaltLength);
    await User.create({
      name,
      email,
      hashedPassword,
    });
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

router.get("/checkAuth", checkAuthenticated, (req, res) => {
  console.log("Reaching route /checkAuth, req.user: ", req.user);
  res.status(200).json({
    authenticated: true,
    user: req.user,
  });
});

router.post("/login", checkNotAuthenticated, handleLogin);

router.post("/register", checkNotAuthenticated, handleRegister, handleLogin);

router.get("/logout", checkAuthenticated, (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
