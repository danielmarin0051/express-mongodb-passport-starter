const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { mongoURI, bcryptSaltLength } = require("../config/config");
const User = require("../schemas/User");
const { users } = require("./initialData");

const removePromises = [User.deleteMany({})];

async function reloadDatabaseHelper() {
  try {
    await Promise.all(removePromises);
    await Promise.all(
      users.map(async (user) => {
        const { name, email, password } = user;
        const hashedPassword = await bcrypt.hash(password, bcryptSaltLength);
        await User.create({
          name,
          email,
          hashedPassword,
        });
      })
    );
  } catch (err) {
    console.log("Error while reloading database: ", err);
  }
}

async function reloadDB() {
  try {
    console.log("Reloading database");
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await reloadDatabaseHelper();
    console.log("Database sucessfully reloaded");
    // const usersInDatabase = await User.find();
    // console.log("users: ", usersInDatabase);
  } catch (err) {
    console.log("Error reloading database: ", err);
  }
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.log("Error while disconnecting from database:", err);
  }
}

if (require.main === module) {
  reloadDB();
}

module.exports = reloadDB;
