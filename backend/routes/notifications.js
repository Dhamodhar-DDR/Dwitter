const router = require("express").Router();
const User = require("../Models/user.model");

router.route("/display/:profilename/:number").get(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then(user => {
            var send_pack = []
            var i = req.params.number;
            console.log(i)
            for (i; i < req.params.number + 10; i++) {
                if (i >= user.notifications[1].length) {
                    break;
                }
                send_pack.push(user.notifications[1][i]);
            }
            res.json([user.notifications[0], send_pack])

            var temp = user.notifications;
            temp[0] = 0;
            user.updateOne({ notifications: temp })
                .then(() => { })
                .catch(err => console.log(err))

        })
        .catch(err => res.status(404).json(err))
})

router.route("/notif_num/:profilename").get(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then(user => {
            res.json(user.notifications[0])
        })
        .catch(err => res.status(404).json(err))
})


module.exports = router;
