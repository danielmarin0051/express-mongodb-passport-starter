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
    // console.log("Login received user: ", user);
    if (err) {
      res.sendStatus(401);
    }
    // if (message) console.log(message);
    req.logIn(user, (error) => {
      if (error) {
        res.sendStatus(401);
        return;
      }
      res.json({
        isAuthenticated: true,
        user,
      });
    });
  })(req, res);
};

const handleRegister = async (req, res, next) => {
  // console.log("Attempting to register user: ", req.body);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.sendStatus(401);
      return;
    }
    if ((await User.findOne({ email })) !== null) {
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

router.post("/login", checkNotAuthenticated, handleLogin);
router.post("/register", checkNotAuthenticated, handleRegister, handleLogin);
router.get("/logout", checkAuthenticated, (req, res) => {
  req.logOut();
  res.sendStatus(200);
});
router.get("/checkAuth", checkAuthenticated, (req, res) => {
  // console.log("Reaching route /checkAuth, req.user: ", req.user);
  res.status(200).json({
    isAuthenticated: true,
    user: req.user,
  });
});
router.get("/deleteUser", checkAuthenticated, async (req, res) => {
  try {
    // console.log("Deleting user: ", req.user);
    const userDeleted = await User.findByIdAndDelete(req.user.id);
    // console.log("User deleted: ", userDeleted);
    if (!userDeleted) res.sendStatus(404);
    else {
      req.logOut();
      res.sendStatus(200);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
