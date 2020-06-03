const router = require("express").Router();
const User = require("../Models/user.model");

router.route("/").get(function (req, res) {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/signup").post(function (req, res) {
  const name = req.body.name;
  const profilename = req.body.profilename;
  const password = req.body.password;
  const bio = "";
  const location = "";
  const messages = [];
  const followers = [];
  var following = [];
  following.push(req.body.profilename)
  var temp = [];
  temp.push(req.body.profilename);
  temp.push(0);
  const loggedin = 0;
  const total_mess_len = 0;
  const notifications = [0, []];

  const newUser = new User({
    name,
    profilename,
    password,
    bio,
    location,
    messages,
    total_mess_len,
    temp,
    followers,
    following,
    loggedin,
    notifications,
  });

  console.log(newUser)

  newUser
    .save()
    .then(() => res.json("Account Created"))
    .catch((err) => {
      console.log(err)
      res.status(400).json("Error: " + err)
    });
});

router.route("/:id").delete(function (req, res) {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/login").post(function (req, res) {
  User.findOne({ profilename: req.body.profilename })
    .then((user) => {
      if (user.password === req.body.password) {
        user.loggedin = 1;
        user.save();
        res.json("Y");
      } else {
        res.json("N");
      }
    })
    .catch((err) => res.status(404).json(err));
});

router.route("/logout/:profilename").get(function (req, res) {
  User.findOne({ profilename: req.params.profilename })
    .then((user) => {
      user.loggedin = 0;
      user.save();
      res.json("Y");
    })
    .catch((err) => res.status(404).json(err));
});

router.route("/auth/:profilename").get(function (req, res) {
  User.findOne({ profilename: req.params.profilename })
    .then((user) => {
      if (user.loggedin === 1) {
        res.json("Y");
      } else {
        res.json("N" + user.loggedin);
      }
    })
    .catch((err) => res.status(404).json(err));
});

router.route("/details/:profilename").get(function (req, res) {
  User.findOne({ profilename: req.params.profilename })
    .then((user) => {
      res.json([user.name, user.bio, user.location])
    })
})

router.route("/update/:profilename").post(function (req, res) {
  User.findOne({ profilename: req.params.profilename })
    .then((user) => {
      user.name = req.body.name;
      user.bio = req.body.bio;
      user.location = req.body.location;

      user.save()
        .then(() => { })
        .catch(err => res.status(400).json(err));
    })
    .catch((err) => res.status(404).json(err));

})


module.exports = router;
