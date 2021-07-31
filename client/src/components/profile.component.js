import React, { Component } from "react";
import axios from "axios";
import "./CSS/navbar.css"
import Navbar from "./leftnavbar.component";
import Mess_box from "./messbox.component";

class Profiles extends Component {
  constructor(props) {
    super(props);

    this.handle_flwbutton = this.handle_flwbutton.bind(this);
    this.handle_likes = this.handle_likes.bind(this);
    this.DisplayDweets = this.DisplayDweets.bind(this);
    this.handle_comments = this.handle_comments.bind(this);
    this.handle_comments2 = this.handle_comments2.bind(this);
    this.handle_messbox_onClick = this.handle_messbox_onClick.bind(this);
    this.ownfun = this.ownfun.bind(this);
    this.edit_bio = this.edit_bio.bind(this);
    this.edit_location = this.edit_location.bind(this);
    this.edit_name = this.edit_name.bind(this);
    this.edit_submit = this.edit_submit.bind(this);
    this.edit_propic = this.edit_propic.bind(this);

    this.state = {
      messages: [],
      messages_len: -1,
      isfollow: "Follow",
      own: false,
      edit_details: {
        name: "",
        bio: "",
        location: "",
        profilepic: "",
      },
      user_details: {
        name: "",
        bio: "",
        location: "",
        profilepic: "",
      },
      followers_count: 0,
      following_count: 0,
      notif_num: "",
      load: "block",
    };
  }

  componentDidMount() {

    if (this.props.match.params.profilename === this.props.match.params.searchval) {
      this.setState({
        own: true
      })
    }

    axios.get("/api/notifications/notif_num/" + this.props.match.params.profilename)
      .then((res) => {
        if (res.data === 0) {
          this.setState({
            notif_num: "",
          })
        }
        else {
          this.setState({
            notif_num: res.data,
          })
        }
        console.log(this.state.notif_num)
      })
      .catch(err => { console.log(err) });

    axios.get("/api/user/details/" + this.props.match.params.searchval)
      .then((res) => {
        var temp = {
          name: res.data[0],
          bio: res.data[1],
          location: res.data[2],
          profilepic: res.data[3],
        }
        this.setState({
          edit_details: temp,
          followers_count: res.data[4],
          following_count: res.data[5],
        })
      })

    axios.get("/api/user/details/" + this.props.match.params.searchval)
      .then((res) => {
        var temp2 = {
          name: res.data[0],
          bio: res.data[1],
          location: res.data[2],
          profilepic: res.data[3],
        }
        this.setState({
          user_details: temp2
        })
      })


    axios
      .get("/api/messages/profile/" + this.props.match.params.searchval)
      .then((res) => {
        var temp = res.data, i = 0;
        for (i = 0; i < temp.length; i++) {
          var t = this.state.messages_len;
          this.setState({
            messages_len: t + 1,
          })
          temp[i].push(this.state.messages_len)
        }

        var temparray = this.state.messages.concat(temp);
        this.setState({
          messages: temparray,
          load: "none",
        })
        document.getElementById("loader").style.display = this.state.load;
      });

    if (!this.state.own) {
      axios
        .get("/api/follow/isfollow/" + this.props.match.params.profilename + "/" + this.props.match.params.searchval)
        .then(res => {
          if (res.data === true) {
            this.setState({
              isfollow: "Unfollow",
            })
          }
          else {
            this.setState({
              isfollow: "Follow",
            })
          }
        })
    }
  }

  handle_flwbutton(e) {
    const followername = {
      profilename: this.props.match.params.searchval,
    };

    const followingname = {
      profilename: this.props.match.params.profilename,
    };

    if (this.state.isfollow === "Follow") {
      axios
        .post("/api/follow/follower/" + this.props.match.params.searchval, followingname)
        .then(() => {
          var ftemp = this.state.followers_count;
          this.setState({
            followers_count: ftemp + 1,
          })
        })
        .catch((err) => console.log(err));
      axios
        .post("/api/follow/following/" + this.props.match.params.profilename, followername)
        .then(() => { })
        .catch((err) => console.log(err));
      this.setState({
        isfollow: "Unfollow"
      })
    }

    else if (this.state.isfollow === "Unfollow") {
      axios
        .post("/api/follow/unfollower/" + this.props.match.params.searchval, followingname)
        .then(() => {
          var ftemp = this.state.followers_count;
          this.setState({
            followers_count: ftemp - 1,
          })
        })
        .catch((err) => console.log(err));
      axios
        .post("/api/follow/unfollowing/" + this.props.match.params.profilename, followername)
        .then(() => { })
        .catch((err) => console.log(err));
      this.setState({
        isfollow: "Follow"
      })
    }
  }

  handle_likes(belike, mess_len) {

    var temp = this.state.messages;
    var checkBox = document.getElementById(belike);

    if (checkBox.checked === true) {

      temp[mess_len][1].likes.push(this.props.match.params.profilename)

      this.setState({
        messages: temp,
      })

      axios
        .post("/api/likeroute/like/othuser/" + this.props.match.params.profilename + "/" + belike)
        .then(() => { console.log("hurray2") })
        .catch(err => console.log(err));

      axios
        .post("/api/likeroute/like/main/" + this.props.match.params.profilename + "/" + belike)
        .then(() => { console.log("hurray1") })
        .catch(err => console.log(err));
    }
    else {

      var index = temp[mess_len][1].likes.indexOf(this.props.match.params.profilename);
      temp[mess_len][1].likes.splice(index, 1);

      this.setState({
        messages: temp,
      })

      axios
        .post("/api/likeroute/dislike/othuser/" + this.props.match.params.profilename + "/" + belike)
        .then(() => { console.log("hurray2") })
        .catch(err => console.log(err));

      axios
        .post("/api/likeroute/dislike/main/" + this.props.match.params.profilename + "/" + belike)
        .then(() => { console.log("hurray1") })
        .catch(err => console.log(err));
    }

  }

  handle_comments(belike) {
    const send_comm = {
      comment_cont: this.state.comment,
    }
    axios
      .post("/api/commentroute/add/" + this.props.match.params.profilename + "/" + belike, send_comm)
      .then((res) => {
        console.log("Hello");
      })
      .catch((err) => console.log(err));
  }

  handle_comments2(e) {
    this.setState({
      comment: e.target.value,
    })
  }

  handle_messbox_onClick(belike) {
    this.props.history.push(
      "/status/" + belike + "/" + this.props.match.params.profilename
    );
  }

  DisplayDweets(temparr, DP) {
    return temparr.map((cur_mess) => {
      var index = cur_mess[1].likes.indexOf(this.props.match.params.profilename)
      var check = "";
      if (index >= 0) {
        check = "checked";
      }
      var comment_cont = "";
      return <Mess_box handle_messbox_onClick={this.handle_messbox_onClick} comment_cont={comment_cont} propic={this.state.user_details.profilepic} handle_comments={this.handle_comments} handle_comments2={this.handle_comments2} close_popup={this.close_popup} check_like={check} pname={this.props.match.params.profilename} message={cur_mess} DP={DP} likefun={this.handle_likes} />;
    });
  }

  edit_propic(e) {
    var temp2 = this.state.edit_details;
    var temp = e.target.files[0];
    const reader = new FileReader();
    const self = this;
    reader.addEventListener("load", function () {
      temp2.profilepic = this.result;
      self.setState({
        edit_details: temp2
      })
    })
    reader.readAsDataURL(temp);
  }

  edit_name(e) {
    var temp = this.state.edit_details;
    temp.name = e.target.value;
    this.setState({
      edit_profile: temp,
    })
  }

  edit_bio(e) {
    var temp = this.state.edit_details;
    temp.bio = e.target.value;
    this.setState({
      edit_profile: temp,
    })
    console.log("h" + this.state.user_details.bio)

  }

  edit_location(e) {
    var temp = this.state.edit_details;
    temp.location = e.target.value;
    this.setState({
      edit_profile: temp,
    })
  }

  edit_submit(e) {
    e.preventDefault();
    const user = {
      name: this.state.edit_details.name,
      bio: this.state.edit_details.bio,
      location: this.state.edit_details.location,
      profilepic: this.state.edit_details.profilepic,
    }
    this.setState({
      user_details: this.state.edit_details
    })
    axios.post("/api/user/update/" + this.props.match.params.searchval, user)
      .then(() => { })
      .catch(err => console.log(err))
  }


  ownfun() {
    if (this.state.own === false) {
      return (
        <div>
          <button className="Follow_btn" onClick={this.handle_flwbutton}>{this.state.isfollow}</button>
        </div>
      )
    }
    else {
      return (
        <div>
          <a className="edit_btn" href="#popup1">Edit Profile</a>
          <div id="popup1" class="overlay">
            <div class="popup">
              <a class="close" href="#">&times;</a>
              <form className="form-group" >
                <label for="img"><img className="editprofile_pic" src={this.state.edit_details.profilepic} /></label>
                <input type="file" id="img" name="img" style={{ visibility: "hidden" }} value={this.state.edit_details.propic} onChange={this.edit_propic} accept="image/*" />
                <br />
                <label>Name</label>
                <br />
                <input onChange={this.edit_name} value={this.state.edit_details.name} type="text" />
                <br />
                <label>Bio</label>
                <br />
                <textarea onChange={this.edit_bio} placeholder="Add Bio" value={this.state.edit_details.bio} rows="5" cols="24"></textarea><br />
                <label>Location</label>
                <br />
                <input onChange={this.edit_location} value={this.state.edit_details.location} type="text" /><br />
                <a class="save_changes_btn" href="#" onClick={this.edit_submit}>Save Changes</a>
              </form>
            </div>
          </div>
        </div >
      )
    }
  }

  render() {
    const DPstyle = {
      height: "9%",
      width: "9%",
      marginLeft: "5px",
      marginRight: "5px",
      float: "left",
      borderRadius: "100%",
    }
    return (
      <div>
        <div className="row" >
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
          <div className="column0"></div>
          <div className="column1">
            <div className="lefnav"></div>
            <div className="lefnav">
              <Navbar notif_num={this.state.notif_num} profilename={this.props.match.params.profilename} />
            </div>
          </div>
          <div className="column2">
            <h5 className="Heading">{this.props.match.params.searchval}</h5>
            <img style={{ marginLeft: "20px" }} className="profile_pic" src={this.state.user_details.profilepic} />
            <h4 style={{ marginLeft: "20px" }}>{this.state.user_details.name}</h4>
            <p style={{ float: "right" }}> {this.state.followers_count} Followers  &nbsp; {this.state.following_count} Following &nbsp;&nbsp;&nbsp;&nbsp; </p>
            <p style={{ marginLeft: "20px", color: "rgba(0,0,0,0.5)" }}>@{this.props.match.params.searchval}</p>
            <p style={{ marginLeft: "20px", fontSize: "15px" }}>{this.state.user_details.bio}</p>
            {this.ownfun()}
            <br />
            <br />
            <button className="profile_buttons">Dweets</button >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button className="profile_buttons">Liked Dweets</button>
            <div>{this.DisplayDweets(this.state.messages, DPstyle)}</div>
            <div className="loader" id="loader"></div>
          </div>
          <div className="column1"></div>
          <div className="column3"></div>
        </div>
      </div>
    );
  }
}

export default Profiles;