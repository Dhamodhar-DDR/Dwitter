const router = require("express").Router();
const User = require("../Models/user.model");

router.route("/createdweet").post(function (req, res) {
  User.findOne({ profilename: req.body.profilename }).then((user) => {
    const newMessage = {
      content: req.body.message,
      likes: [],
      time_act: req.body.time,
      time_s: req.body.time_s,
      mess_id: user.total_mess_len + 1,
      image_files: req.body.image_files,
    }
    console.log(req.body.image_files)
    user.messages.unshift(newMessage);
    user.total_mess_len += 1;

    var message_id = user._id + "_" + user.total_mess_len;
    var store_comment1 = {
      comment_id: message_id,
      fin_comments: [],
    }
    user.comments.unshift(store_comment1)

    user
      .save()
      .then(() => { res.json("Added") })
      .catch((err) => res.status(400).json(err));

  });
});

router.route("/deletedweet/:message_id").delete(function (req, res) {
  var user_id = req.params.message_id.substr(0, 24);
  User.findOne({ _id: user_id })
    .then((user) => {
      var mess_num = req.params.message_id.substr(25, req.params.message_id.length - 1);
      var i = 0, index = -1;
      temp = user.messages;
      for (i = 0; i < temp.length; i++) {
        console.log(user.messages[i].mess_id)
        console.log(mess_num)
        if (user.messages[i].mess_id === parseInt(mess_num, 10)) {
          index = i;
          break;
        }
      }
      console.log(index);
      if (index > -1) {
        var temp_messages = user.messages;
        temp_messages.splice(index, 1);
        console.log(temp_messages);
        var temp_comments = user.comments;
        temp_comments.splice(index, 1);
        console.log("HI1")
        user.save()
        user.updateOne({ comments: temp_comments })
          .then(() => {
            res.json("deleted")
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err)
          });
      }
    })
    .catch(err => console.log(err));

})




router.route("/profile/:profilename").get(function (req, res) {
  User.findOne({ profilename: req.params.profilename })
    .then(user => {
      var like_store_id, i, send_mess = [];
      for (i = 0; i < user.messages.length; i++) {
        like_store_id = user._id + "_" + user.messages[i].mess_id;
        send_mess.push([user.profilename, user.messages[i], like_store_id])
      }
      res.json(send_mess)
    })
    .catch(err => console.log(err));
})

router.route("/:profilename").get(function (req, res) {
  User.findOne({ profilename: req.params.profilename })
    .then(mainuser => {
      var array = mainuser.following;
      var send_array = [];
      User.find({ profilename: { $in: array } }).
        then(followingusers => {
          var j = 0;
          var temp_store_arr = [];
          for (j = 0; j < mainuser.temp.length; j++) {
            temp_store_arr.push(mainuser.temp[j])
          }
          for (j = 0; j < 10; j++) {
            var i = 0;
            var max = 0;
            var mess_to_send = null;
            for (i = 0; i < followingusers.length; i++) {
              var index = temp_store_arr.indexOf(followingusers[i].profilename) + 1;
              var limit = temp_store_arr[index];
              if (limit < followingusers[i].messages.length) {
                if (max < followingusers[i].messages[limit].time_s) {
                  max = followingusers[i].messages[limit].time_s;
                  mess_to_send = followingusers[i].messages[limit];
                  username_of_mess = followingusers[i].profilename;
                  id_of_user = followingusers[i]._id;
                  id_of_mess = followingusers[i].messages[limit].mess_id;
                }
              }
            }
            if (mess_to_send === null) {
              break;
            }
            var like_store_id = id_of_user + "_" + id_of_mess;
            send_array.push([username_of_mess, mess_to_send, like_store_id]);
            temp_store_arr[temp_store_arr.indexOf(username_of_mess) + 1] += 1;
          }
          mainuser.temp = temp_store_arr;
          mainuser.save()
            .then(() => res.json(send_array))
            .catch(err => res.json(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
})

router.route("/statusmess/:belike").get(function (req, res) {
  var user_id = req.params.belike.substr(0, 24);
  var message_id = parseInt(req.params.belike.substr(25, req.params.belike.length - 1), 10);

  User.findById(user_id)
    .then(user => {
      var i;
      var send;
      for (i = 0; i < user.messages.length; i++) {
        if (user.messages[i].mess_id === message_id) {
          send = user.messages[i];
          break;
        }
      }
      send = [send, user.profilename]
      console.log(send)
      res.json(send);
    })
    .catch(err => res.status(404).json(err));
})

router.route("/cleanup/:profilename").get(function (req, res) {
  User.findOne({ profilename: req.params.profilename })
    .then(user => {
      var i = 0, k = 0;
      var temp_store_arr = [];
      for (i = 0; i < user.following.length; i++) {
        temp_store_arr.push(user.following[i]);
        temp_store_arr.push(0);
      }
      user.temp = temp_store_arr;
      user
        .save()
        .then(() => { res.json("Updated") })
        .catch(err => res.status(400).json(err))
    })
    .catch(err => res.status(400).json(err))
})


module.exports = router;
