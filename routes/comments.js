const router = require("express").Router();
const User = require("../Models/user.model");

router.route("/add/:profilename/:message_id").post(function (req, res) {
    var user_id = req.params.message_id.substr(0, 24);

    User.findOne({ _id: user_id })
        .then((user) => {
            var i, temp;
            var store_comment = {
                comment_profilename: req.params.profilename,
                comment_content: req.body.comment_cont,
            }
            var len = user.comments.length
            for (i = 0; i < len; i++) {
                if (user.comments[i].comment_id === req.params.message_id) {
                    temp = user.comments
                    temp[i].fin_comments.unshift(store_comment);
                    break;
                }
            }
            user.updateOne({ comments: temp })
                .then(() => { })
                .catch(err => {
                    console.log(err)
                    res.status(400).json(err)
                })
            if (user.profilename !== req.params.profilename) {
                var temp_not_num = user.notifications[0] + 1;
                temp = {
                    data: req.params.profilename + " has commented on your dweet!",
                    status: req.params.message_id,
                }
                var temp2 = user.notifications[1];
                temp2.unshift(temp);
                user.updateOne({ notifications: [temp_not_num, temp2] })
                    .then(() => res.json("UPDATED"))
                    .catch(err => {
                        console.log(err + "inOth");
                        res.status(400).json(err)
                    });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err)
        }
        );
})


router.route("/display/:belike/:number").get(function (req, res) {
    var user_id = req.params.belike.substr(0, 24);

    User.findById(user_id)
        .then(user => {
            var send_pack = []
            var i = req.params.number, j;
            console.log(i)
            for (j = 0; j < user.comments.length; j++) {
                if (user.comments[j].comment_id === req.params.belike) {
                    for (i; i < req.params.number + 10; i++) {
                        if (i >= user.comments[j].fin_comments.length) {
                            break;
                        }
                        send_pack.push(user.comments[j].fin_comments[i]);
                        console.log(send_pack)
                    }
                    break;
                }
            }
            res.json(send_pack)
        })
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})



module.exports = router;
