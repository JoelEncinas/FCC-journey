const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
let User = require("./userModel");
let Exercise = require("./exerciseModel");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri =
  "mongodb+srv://admin:admin@cluster0.pug2uxj.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("connected to db");
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  const newUser = new User({ username });

  newUser
    .save()
    .then((savedUser) =>
      res.json({ username: savedUser.username, _id: savedUser._id })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/api/users", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.post("/api/users/:_id/exercises", (req, res) => {
  User.findOne({ _id: req.params._id })
    .then((user) => {
      const username = user.username;
      const _id = req.params._id;
      const description = req.body.description;
      const duration = Number(req.body.duration);
      let date;

      if (typeof req.body.date === "undefined" || req.body.date === "") {
        let now = new Date();
        let dd = String(now.getDate()).padStart(2, "0");
        let mm = String(now.getMonth() + 1).padStart(2, "0");
        let yyyy = now.getFullYear();
        dateString = yyyy + "/" + mm + "/" + dd;

        const newDate = new Date(dateString);
        date = newDate
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .replace(/,/g, "");
      } else {
        const newDate = new Date(req.body.date);
        date = newDate
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .replace(/,/g, "");
      }

      const userId = user._id;

      const newExercise = new Exercise({
        userId,
        description,
        duration,
        date,
      });

      newExercise
        .save()
        .then((exercise) =>
          res.json({
            _id: _id,
            username: username,
            date: exercise.date,
            duration: exercise.duration,
            description: exercise.description,
          })
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

app.get("/api/users/:_id/logs", (req, res) => {
  const userId = req.params._id;
  User.find({ _id: userId })
    .then((user) => {
      // const exercises = Exercise.find({ userId: userId });

      // console.log(exercises);
      console.log(user);
      return res.json({ user: 3 });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

const listener = app.listen(3000, () => {
  console.log("Your app is listening on port 3000");
});
