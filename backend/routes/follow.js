const router = require("express").Router();
const User = require("../Models/user.model");

router.route("/follower/:profilename").post(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then((user) => {
            if (user.following.indexOf(req.body.profilename) === -1) {
                user.followers.push(req.body.profilename);
                user
                    .save()
                    .then(() => res.json("Updated"))
                    .catch((err) => res.status(400).json(err));


            }

            var temp_not_num = user.notifications[0] + 1;
            console.log("HELAS")
            temp = {
                data: req.body.profilename + " started following you",
                status: null,
            }
            var temp2 = user.notifications[1];
            temp2.unshift(temp);

            user.updateOne({ notifications: [temp_not_num, temp2] })
                .then(() => res.json("UPDATED"))
                .catch(err => {
                    console.log(err + "inOth");
                    res.status(400).json(err)
                });
        })
        .catch((err) => res.status(404));
});

router.route("/following/:profilename").post(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then((user) => {
            if (user.following.indexOf(req.body.profilename) === -1) {
                user.following.push(req.body.profilename);
                user.temp.push(req.body.profilename);
                user.temp.push(0);
                user
                    .save()
                    .then(() => res.json("Updated"))
                    .catch((err) => res.status(400).json(err));
            }
        })
});

router.route("/unfollower/:profilename").post(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then((user) => {
            const index = user.followers.indexOf(req.body.profilename);


            if (index > -1) {
                user.followers.splice(index, 1);
            }
            user
                .save()
                .then(() => res.json("Updated"))
                .catch((err) => res.status(400).json(err));
        })
        .catch((err) => res.status(404));
});

router.route("/unfollowing/:profilename").post(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then((user) => {
            const index = user.following.indexOf(req.body.profilename);
            const index2 = user.temp.indexOf(req.body.profilename);
            if (index > -1) {
                user.following.splice(index, 1);
                user.temp.splice(index2, 1);
            }
            user
                .save()
                .then(() => res.json("Updated"))
                .catch((err) => res.status(400).json(err));
        })
        .catch((err) => res.status(404));
});

router.route("/isfollow/:profilename/:followingname").get(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then(user => {
            if (user.following.includes(req.params.followingname)) {
                res.json(true)
            }
            else {
                res.json(false)
            }
        })
        .catch(err => res.status(404).json(err));
})

module.exports = router;
