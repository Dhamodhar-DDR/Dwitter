import React, { Component } from "react";
import axios from "axios";
import Navbar from "./leftnavbar.component";

const Comment_Box = (props) => (
    <div>
        <h6>{props.comm.comment_profilename}</h6>
        <p>{props.comm.comment_content}</p>
    </div>
)

class Status extends Component {
    constructor(props) {
        super(props);

        this.display_comments = this.display_comments.bind(this);
        this.handle_likes = this.handle_likes.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            Dweet_pname: "",
            comm_num: 0,
            message: [],
            lik_check: "",
            comments: [],
            likes: 0,
            comment: "",
        }
    }


    componentDidMount() {
        axios.get("/api/messages/statusmess/" + this.props.match.params.belike)
            .then(res => {
                this.setState({
                    message: res.data[0],
                    Dweet_pname: res.data[1],
                    likes: res.data[0].likes.length,
                    Dweet_propic: res.data[2],
                })
                var index = this.state.message.likes.indexOf(this.props.match.params.profilename)
                if (index >= 0) {
                    this.setState({
                        lik_check: "checked"
                    })
                }
            })
            .catch(err => console.log(err))
        axios.get("/api/commentroute/display/" + this.props.match.params.belike + "/" + this.state.comm_num)
            .then(res => {
                var i, temparray;
                var previousval = this.state.comm_num;
                for (i = 0; i < res.data.length; i++) {
                    temparray = this.state.comments.concat(res.data[i]);
                    this.setState({
                        comments: temparray,
                    });
                }
                this.setState({
                    comm_num: previousval + 10,
                })
            })
            .catch(err => console.log(err))
        window.addEventListener("scroll", this.handleScroll);
    }

    handleScroll(e) {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            axios.get("/api/commentroute/display/" + this.props.match.params.belike + "/" + this.state.comm_num)
                .then(res => {
                    var i, temparray;
                    var previousval = this.state.comm_num;
                    for (i = 0; i < res.data.length; i++) {
                        temparray = this.state.comments.concat(res.data[i]);
                        this.setState({
                            comments: temparray,
                        });
                    }
                    this.setState({
                        comm_num: previousval + 10,
                    })
                })
                .catch(err => console.log(err))
        }
    }



    handle_likes(belike) {

        var checkBox = document.getElementById(belike);
        console.log(checkBox.checked)

        if (checkBox.checked === true) {
            var temp = this.state.likes;
            var temp2 = this.state.message
            temp2.likes.push(this.props.match.params.profilename)
            this.setState({
                likes: temp + 1,
                message: temp2,
            })

            axios
                .post("/api/likeroute/like/othuser/" + this.props.match.params.profilename + "/" + belike)
                .then(() => { console.log("hurray2") })
                .catch(err => console.log(err));

            axios
                .post("/api/likeroute/like/main/" + this.props.match.params.profilename + "/" + belike)
                .then(() => {
                    this.setState({
                        lik_check: "checked"
                    })
                })
                .catch(err => console.log(err));

        }
        else {

            var temp = this.state.likes;
            var temp2 = this.state.message;
            var index = temp2.likes.indexOf(this.props.match.params.profilename);
            temp2.likes.splice(index, 1);

            this.setState({
                likes: temp - 1,
                message: temp2,
            })

            axios
                .post("/api/likeroute/dislike/othuser/" + this.props.match.params.profilename + "/" + belike)
                .then(() => { console.log("hurray2") })
                .catch(err => console.log(err));

            axios
                .post("/api/likeroute/dislike/main/" + this.props.match.params.profilename + "/" + belike)
                .then(() => {
                    this.setState({
                        lik_check: ""
                    })
                })
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
        // console.log("ADSAd")
        this.setState({
            comment: e.target.value,
        })
        // console.log(this.state.comment)
    }

    display_comments(temparr) {
        return temparr.map((curr_comm) => {
            return <Comment_Box comm={curr_comm} />
        })
    }


    render() {
        const DP = {
            height: "6%",
            width: "10%",
            float: "left",
            borderRadius: "100%",
        }
        return (
            <div className="row" id="home_div" disabled>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <div className="column0"></div>
                <div className="column1">
                    <div className="lefnav">
                        <Navbar notif_num="" profilename={this.props.match.params.profilename} />
                    </div>
                </div>
                <div className="column2">
                    <div className="heading">
                        <h5 >Dweet</h5>
                    </div>
                    < div >
                        < div className="messs_box">
                            <br />
                            <img style={DP} src={this.state.Dweet_propic} />
                            <h5 className="M_Box_name">{this.state.Dweet_pname}</h5>
                            <br />
                            <p className="mess_content">{this.state.message.content}</p>
                            <br />
                        </div>
                        <label class="container">
                            <input type="checkbox" id={this.props.match.params.belike} checked={this.state.lik_check} onClick={() => { this.handle_likes(this.props.match.params.belike) }} />
                            <span class="checkmark1">
                                <i class="material-icons">favorite_border</i>
                            </span>
                        </label>
                        <div className="options">
                            <div className="like_count">{this.state.likes}</div>
                            <a class="button" href={"#" + "com_id" + this.props.match.params.belike}><i class="material-icons">chat_bubble_outline</i></a>
                            <div id={"com_id" + this.props.match.params.belike} class="overlay">
                                <div class="popup">
                                    <img style={DP} src={require("./CSS/def_dp.png")} />
                                    <h2>{this.state.Dweet_pname}</h2>
                                    <a class="close" href="#">&times;</a>
                                    <div class="content">
                                        <p className="mess_content">{this.state.message.content}</p>
                                        <img style={DP} src={require("./CSS/def_dp.png")} />
                                        <div onChange={(e) => this.handle_comments2(e)}>
                                            <textarea rows="5" cols="45" placeholder="Reply" >
                                            </textarea>
                                        </div>
                                        <button onClick={() => this.handle_comments(this.props.match.params.belike)}>Reply</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                    {this.display_comments(this.state.comments)}
                </div>
                <div className="column1"></div>
                <div className="column3"></div>
            </div>
        )
    }
}

export default Status;