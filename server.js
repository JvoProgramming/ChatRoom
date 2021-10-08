// import dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const mongoose = require("mongoose");
const config = require("config");
const path = require("path");
const Room = require("./models/Rooms");
const nameGen = require("./util/roomIdGenerator.js");
require("dotenv").config();

// import handlers
const homeHandler = require("./controllers/home.js");
const roomHandler = require("./controllers/room.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const db = config.get("mongoURI");

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//controller handlers to handle requests at each endpoint
app.post("/create", function (req, res) {
  const newRoom = new Room({
    name: req.body.roomName,
  });
  newRoom
    .save()
    .then(console.log("room", req.body.roomName, "added"))
    .catch((e) => console.log(e));
});

var randomName;
app.post("/createRandom", function (req, res) {
  randomName = nameGen.roomIdGenerator();
  const newRoom = new Room({
    name: randomName,
  });
  newRoom
    .save()
    .then(console.log("room", randomName, "added"))
    .catch((e) => console.log(e));
});

app.post("/sendMessage", function (req, res) {
  console.log(req.body);
  if (req.body.userID != null) {
    Room.findOneAndUpdate(
      { name: req.body.roomID },
      {
        $push: {
          messages:
            new Date().toISOString() +
            " | " +
            req.body.userID +
            ": " +
            req.body.message,
        },
      },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          //
        }
      }
    );
  } else {
    console.log("User not signed in");
  }
});

app.get("/getRoom", function (req, res) {
  Room.find()
    .lean()
    .then((items) => {
      res.json(items);
    });
});
app.get("/", homeHandler.getHome);
app.get("/:roomName", roomHandler.getRoom);

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
