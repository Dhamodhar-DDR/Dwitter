const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = 7070;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", function (req, res) {
  console.log("\nConnection to database has established\n");
});

const userRoute = require("./routes/signup");
const messagesRoute = require("./routes/messages");
const followRoute = require("./routes/follow");
const likeRoute = require("./routes/likes");
const commentRoute = require("./routes/comments");
const notificationsRoute = require("./routes/notifications");


app.use("/user", userRoute);
app.use("/messages", messagesRoute);
app.use("/follow", followRoute);
app.use("/likeroute", likeRoute);
app.use("/commentroute", commentRoute);
app.use("/notifications", notificationsRoute);


app.listen(process.env.PORT || port, () => {
  console.log("Server is listening on port: " + port);
});
