require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

app.post("/register", async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser
      .save()
      .then(() => {
        res.render("secrets");
      })
      .catch((e) => {
        console.log(e);
      });
  });
});

app.post("/login", async (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: userName });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.render("secrets");
      } else {
        console.log("worng password");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("listenning on port 3000");
});
