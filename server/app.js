const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const { mongoURI, sessionSecret } = require("./config/config");
const initializePassport = require("./config/passport-config.js");

initializePassport(passport);

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((err) => console.log(err));

// Initialize server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

// app.use(express.static("../client/build")); // uncomment when deploying to production if on same server
app.use("/api/auth", require("./routes/auth"));

// const PORT = process.env.PORT || 5000;
// // save server in app.server to later stop listening with mocha tests
// app.server = app.listen(PORT, () =>
//   console.log(`Server running on port http://localhost:${PORT}`)
// );
// save disconnect methods to close DB connection from mocha tests
app.disconnect = () => {
  mongoose
    .disconnect()
    // .then(() => console.log("Disconnected from database"))
    .catch((err) => console.log("Error disconnecting from database", err));
};

module.exports = app;
