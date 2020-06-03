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

    this.state = {
      messages: [],
      messages_len: -1,
      isfollow: "Follow",
      own: false,
      edit_details: {},
      user_details: {},
      notif_num: "",
    };
  }

  componentDidMount() {

    if (this.props.match.params.profilename === this.props.match.params.searchval) {
      this.setState({
        own: true
      })
    }

    axios.get("http://localhost:7070/notifications/notif_num/" + this.props.match.params.profilename)
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

    axios.get("http://localhost:7070/user/details/" + this.props.match.params.searchval)
      .then((res) => {
        var temp = {
          name: res.data[0],
          bio: res.data[1],
          location: res.data[2],
        }
        this.setState({
          edit_details: temp
        })
      })

    axios.get("http://localhost:7070/user/details/" + this.props.match.params.searchval)
      .then((res) => {
        var temp2 = {
          name: res.data[0],
          bio: res.data[1],
          location: res.data[2],
        }
        this.setState({
          user_details: temp2
        })
      })


    axios
      .get("http://localhost:7070/messages/profile/" + this.props.match.params.searchval)
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
        })
      });

    if (!this.state.own) {
      axios
        .get("http://localhost:7070/follow/isfollow/" + this.props.match.params.profilename + "/" + this.props.match.params.searchval)
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
        .post("http://localhost:7070/follow/follower/" + this.props.match.params.searchval, followingname)
        .then(() => { })
        .catch((err) => console.log(err));
      axios
        .post("http://localhost:7070/follow/following/" + this.props.match.params.profilename, followername)
        .then(() => { })
        .catch((err) => console.log(err));
      this.setState({
        isfollow: "Unfollow"
      })
    }

    else if (this.state.isfollow === "Unfollow") {
      axios
        .post("http://localhost:7070/follow/unfollower/" + this.props.match.params.searchval, followingname)
        .then(() => { })
        .catch((err) => console.log(err));
      axios
        .post("http://localhost:7070/follow/unfollowing/" + this.props.match.params.profilename, followername)
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
        .post("http://localhost:7070/likeroute/like/othuser/" + this.props.match.params.profilename + "/" + belike)
        .then(() => { console.log("hurray2") })
        .catch(err => console.log(err));

      axios
        .post("http://localhost:7070/likeroute/like/main/" + this.props.match.params.profilename + "/" + belike)
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
        .post("http://localhost:7070/likeroute/dislike/othuser/" + this.props.match.params.profilename + "/" + belike)
        .then(() => { console.log("hurray2") })
        .catch(err => console.log(err));

      axios
        .post("http://localhost:7070/likeroute/dislike/main/" + this.props.match.params.profilename + "/" + belike)
        .then(() => { console.log("hurray1") })
        .catch(err => console.log(err));
    }

  }

  handle_comments(belike) {
    const send_comm = {
      comment_cont: this.state.comment,
    }
    axios
      .post("http://localhost:7070/commentroute/add/" + this.props.match.params.profilename + "/" + belike, send_comm)
      .then((res) => {
        console.log("Hello");
      })
      .catch((err) => console.log(err));
  }

  handle_comments2(e) {
    // console.log("ADSAd")
    this.setState({
      comment: e.target.value,
    })
    // console.log(this.state.comment)
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
      return <Mess_box handle_messbox_onClick={this.handle_messbox_onClick} comment_cont={comment_cont} handle_comments={this.handle_comments} handle_comments2={this.handle_comments2} close_popup={this.close_popup} check_like={check} pname={this.props.match.params.profilename} message={cur_mess} DP={DP} likefun={this.handle_likes} />;
    });
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
    }
    this.setState({
      user_details: this.state.edit_details
    })
    axios.post("http://localhost:7070/user/update/" + this.props.match.params.searchval, user)
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
    const image = {
      height: "15%",
      borderRadius: "50%",
    };
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
            <img src={require("./CSS/def_dp.png")} style={image} />
            <h4>{this.props.match.params.searchval}</h4>
            <p>{this.state.user_details.bio}</p>
            {this.ownfun()}
            <br />
            <br />
            {this.DisplayDweets(this.state.messages, DPstyle)}
          </div>
          <div className="column1"></div>
          <div className="column3"></div>
        </div>

      </div>
    );
  }
}

export default Profiles;