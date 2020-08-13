const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../schemas/User");

async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function initializePassport(passport) {
  console.log("Initializing passport");
  const authenticateUser = async (email, password, done) => {
    console.log("Attempting to authenticate user: ", { email, password });
    try {
      const user = await getUserByEmail(email);
      if (user === null) {
        return done(null, false);
      }
      if (await bcrypt.compare(password, user.hashedPassword)) {
        console.log("User with matching credentials found: ", user);
        const clientUser = {
          email: user.email,
          name: user.name,
          _id: user._id,
        };
        return done(null, clientUser);
      }
      return done(null, false);
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => {
    console.log("Serializing of user: ", user);
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    console.log("Deserializing of user with id: ", id);
    User.findById(id, (err, user) => {
      if (err) {
        done(err, null);
        return;
      }
      const { email, name, _id } = user;
      const clientUser = { email, name, _id };
      done(err, clientUser);
    });
  });
}

module.exports = initializePassport;
