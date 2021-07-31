const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

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


app.use("/api/user", userRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/follow", followRoute);
app.use("/api/likeroute", likeRoute);
app.use("/api/commentroute", commentRoute);
app.use("/api/notifications", notificationsRoute);

if(process.env.NODE_ENV == 'production')
{
  app.use(express.static('client/build'));
  app.get("*", (req, res) => {
  let protected = ['transformed.js', 'main.css', 'favicon.ico']
  let path = req.params['0'].substring(1)

  if (protected.includes(path)) {
    // Return the actual file
    res.sendFile(`${__dirname}/client/build/${path}`);
  } else {
    // Otherwise, redirect to /build/index.html
    res.sendFile(`${__dirname}/client/build/index.html`);
  }
});
}

// const proxy = require('http-proxy-middleware')

// module.exports = function(app) {
//     // add other server routes to path array
//     app.use(proxy(['/api' ], { target: 'http://localhost:5000' }));
// } 


app.listen(port, () => {
  console.log("Server is listening on port: " + port);
});
