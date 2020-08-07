const express = require("express");
const bcrypt = require("bcryptjs");
const users = require("../data/models/user-model");
const restricted = require("../api/restricted-middleware");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await users.findByUsername(username);
  if (user) {
    res.status(400).json({ messsage: "A user with that name already exists!" });
  } else {
    const hash = await bcrypt.hash(password, 14);
    req.body.password = hash;

    // Save username and password in database
    const newUser = await users.add(req.body);
    console.log(newUser);

    res.status(200).json(newUser);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await users.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid User Creds!" });
  } else {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      // Continue as user is valid
      req.session.user = user;
      res.status(200).json({ message: `Welcome, ${username}` });
    }
  }
});

router.get("/", restricted, async (req, res) => {
  try {
    let allUsers = await users.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went horribly wrong, call for help." });
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(error);
        res.json({ message: "Something went wrong logging out..." });
      } else {
        res.json({ message: "You've logged out successfully" });
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
