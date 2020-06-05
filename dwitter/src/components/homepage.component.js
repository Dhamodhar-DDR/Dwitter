import React, { Component } from "react";
import axios from "axios";
import "./CSS/navbar.css";
import "./CSS/homepage.css";
import Navbar from "./leftnavbar.component";
import Mess_box from "./messbox.component"


class Home extends Component {
    constructor(props) {
        super(props);

        this.DisplayDweets = this.DisplayDweets.bind(this);
        this.handle_submit = this.handle_submit.bind(this);
        this.handle_text = this.handle_text.bind(this);
        this.handle_search = this.handle_search.bind(this);
        this.handle_search_submit = this.handle_search_submit.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        this.handle_likes = this.handle_likes.bind(this);
        this.handle_comments = this.handle_comments.bind(this);
        this.handle_comments2 = this.handle_comments2.bind(this);
        this.handle_messbox_onClick = this.handle_messbox_onClick.bind(this);
        this.handle_image_files = this.handle_image_files.bind(this);

        this.state = {
            comment: "",
            messages: [],
            messages_len: -1,
            search: "",
            users: [],
            notif_num: "",
            image_files: [],
        };
    }

    handleScroll(e) {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            axios
                .get(
                    "http://localhost:7070/messages/" + this.props.match.params.profilename
                )
                .then((res) => {
                    // console.log(res.data);
                    var temparray = this.state.messages.concat(res.data);
                    // console.log(temparray);
                    this.setState({
                        messages: temparray,
                    });
                })
                .catch((err) => console.log(err));
        }
    }

    componentCleanup() {
        axios.get("http://localhost:7070/messages/cleanup/" + this.props.match.params.profilename)
            .then(() => { })
            .catch(err => { console.log(err) });
    }

    componentDidMount() {
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

        axios
            .get(
                "http://localhost:7070/user/auth/" + this.props.match.params.profilename
            )
            .then((res) => {
                if (res.data === "Y") {
                    // console.log("");
                } else {
                    // console.log(res.data);
                    this.props.history.push("/login");
                }
            })
            .catch((err) => {
                console.log(err);
                this.props.history.push("/login");
            });
        axios
            .get(
                "http://localhost:7070/messages/" + this.props.match.params.profilename
            )
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
                });
            })
            .catch((err) => console.log(err));
        window.addEventListener("scroll", this.handleScroll);
        window.addEventListener('beforeunload', this.componentCleanup);
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    handle_text(e) {
        this.setState({
            newmessage: e.target.value,
        });
    }

    handle_search(e) {
        this.setState({
            search: e.target.value,
        });
    }

    handle_search_submit(e) {
        e.preventDefault();
        if (this.state.search != "") {
            this.props.history.push(
                "/profile/" + this.props.match.params.profilename + "/" + this.state.search
            );
        }
    }

    handle_submit(e) {
        e.preventDefault();

        const packet = {
            profilename: this.props.match.params.profilename,
            message: this.state.newmessage,
            time: new Date().toLocaleString(),
            time_s: new Date().getTime(),
        };
        if (this.state.newmessage !== "") {
            axios
                .post("http://localhost:7070/messages/createdweet", packet)
                .then((res) => {
                    console.log("Hello");
                    window.location.reload(false);
                })
                .catch((err) => console.log(err));
        }
    }

    handle_image_files(e) {
        var temp = this.state.image_files;
        temp.unshift(e.target.value)
        this.setState({
            image_files: temp
        })
        console.log(this.state.image_files)
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

    render() {
        const DP = {
            height: "9%",
            width: "9%",
            marginLeft: "5px",
            marginRight: "5px",
            float: "left",
            borderRadius: "100%",
        }

        const img_upload_btn = {
            color: "rgb(15, 119, 255)",
            fontSize: "30px",
            cursor: "pointer",
            marginLeft: "62px"

        }

        return (
            <div className="row" id="home_div" disabled>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <div className="column0"></div>
                <div className="column1">
                    <div className="lefnav">
                        <Navbar notif_num={this.state.notif_num} profilename={this.props.match.params.profilename} />
                    </div>
                </div>
                <div className="column2" onScroll={this.handleScroll}>
                    <div className="topnav">
                        Home
                        <input
                            type="text"
                            style={{ marginLeft: "60px", width: "400px", height: "30px", outline: "none" }}
                            placeholder="Search Dwitter"
                            required
                            onChange={this.handle_search}
                        />
                        <i style={{ cursor: "pointer" }} onClick={this.handle_search_submit} className="material-icons">search</i>

                    </div>
                    <div className="newdweet_form">
                        <br />
                        <br />
                        <form onSubmit={this.handle_submit}>
                            <div className="input-group">
                                <div className="input-group-prepend"></div>
                                <img src={require("./CSS/def_dp.png")} style={DP} />
                                <textarea
                                    placeholder="What's happening?"
                                    onChange={this.handle_text}
                                    value={this.state.newmessage}
                                    required
                                    className="createdweet_input"
                                    aria-label="With textarea"
                                    cols="45"
                                ></textarea>
                            </div>
                            <input
                                type="submit"
                                value="Dweet"
                                className="btn btn-primary"
                                style={{ float: "right", borderRadius: "90px" }}
                            />
                            <label for="img"><i class="material-icons" style={img_upload_btn}>add_photo_alternate</i></label>
                            <input type="file" id="img" name="img" onChange={this.handle_image_files} value={this.state.image_files} style={{ visibility: "hidden" }} accept="image/*" />
                        </form>
                    </div>
                    {this.DisplayDweets(this.state.messages, DP)}
                </div>
                <div className="column1"></div>
                <div className="column3"></div>
            </div >
        );
    }
}

export default Home;
