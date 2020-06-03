const router = require("express").Router();
const User = require("../Models/user.model");

router.route("/like/main/:profilename/:belike").post(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then(mainuser => {
            var temp = mainuser.liked_messages;
            temp.unshift(req.params.belike);
            mainuser.updateOne({ liked_messages: temp })
                .then(() => { res.json() })
                .catch(err => {
                    console.log(err + "in Main");
                    res.status(400).json(err)
                });
        })
        .catch(err => {
            console.log(err + "inmain");
            res.status(400).json(err)
        });
});

router.route("/like/othuser/:mainuser/:otherpack").post(function (req, res) {
    var user_id = req.params.otherpack.substr(0, 24);

    User.findById(user_id)
        .then(user => {
            var len = user.messages.length;

            var mess_id = req.params.otherpack.substr(25, req.params.otherpack.length - 1);

            console.log(mess_id);

            var temp = user.messages;

            temp[len - mess_id].likes.unshift(req.params.mainuser)

            user.messages = temp;

            if (user.profilename !== req.params.mainuser) {
                var temp_not_num = user.notifications[0] + 1;
                temp = {
                    data: req.params.mainuser + " has liked your dweet!",
                    status: req.params.otherpack,
                }
                var temp2 = user.notifications[1];
                temp2.unshift(temp);
                user.updateOne({ notifications: [temp_not_num, temp2] })
                    .then(() => res.json("UPDATED"))
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err)
                    });
            }
            user.markModified('messages', 'notifications');      //VERY VERY 
            user.save()
                .then(() => res.json("UPDATED"))
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err)
                });

        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
})

router.route("/dislike/othuser/:mainuser/:otherpack").post(function (req, res) {
    var user_id = req.params.otherpack.substr(0, 24);
    User.findById(user_id)
        .then(user => {
            var len = user.messages.length;

            var mess_id = req.params.otherpack.substr(25, req.params.otherpack.length - 1);

            var index = user.messages[len - mess_id].likes.indexOf(req.params.mainuser)

            user.messages[len - mess_id].likes.splice(index, 1);
            user.markModified('messages');
            user.save()
                .then(() => res.json())
                .catch(err => {
                    res.status(400).json(err)
                    console.log(err);
                });
        })
        .catch(err => res.status(400).json(err));
})

router.route("/dislike/main/:profilename/:belike").post(function (req, res) {
    User.findOne({ profilename: req.params.profilename })
        .then(mainuser => {
            var index = mainuser.liked_messages.indexOf(req.params.belike)
            var temp = mainuser.liked_messages
            temp.splice(index, 1);
            mainuser.updateOne({ liked_messages: temp })
                .then(() => { res.json("updated") })
                .catch(err => res.status(400).json(err))
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;
