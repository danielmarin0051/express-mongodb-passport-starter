const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { mongoURI, bcryptSaltLength } = require("../config/config");
const User = require("../schemas/User");
const { users } = require("./initialData");

console.log("Fake users: ", users);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const removePromises = [User.deleteMany({})];

async function realoadDatabaseHelper() {
  try {
    await Promise.all(removePromises);
    console.log("All data removed from database");
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

(async function realoadDatabase() {
  try {
    await realoadDatabaseHelper();
    console.log("Database sucessfully reloaded, contents: ");
    const usersInDatabase = await User.find();
    console.log("users: ", usersInDatabase);
  } catch (err) {
    console.log("Error reloading database: ", err);
  }
  mongoose
    .disconnect()
    .then(() => console.log("Disconnected from database"))
    .catch((err) => console.log("Error disconnecting from database", err));
})();
