import React, { Component } from "react";
import axios from "axios";
import "./CSS/login.css";

var userpname = "";

class Login extends Component {
    constructor(props) {
        super(props);

        this.handle_pass = this.handle_pass.bind(this);
        this.handle_pname = this.handle_pname.bind(this);
        this.handle_submit = this.handle_submit.bind(this);

        this.state = {
            profilename: "",
            password: "",
            bool: "",
        };
    }

    handle_pass(e) {
        this.setState({
            password: e.target.value,
        });
    }

    handle_pname(e) {
        this.setState({
            profilename: e.target.value,
        });
    }

    handle_signup(e) {
        e.preventDefault();
        document.getElementById("myForm").style.display = "block";

    }

    handle_submit(e) {
        e.preventDefault();

        userpname = this.state.profilename;

        const userlog = {
            profilename: this.state.profilename,
            password: this.state.password,
        };

        axios
            .post("http://localhost:7070/user/login", userlog)
            .then((res) => {
                if (res.data === "Y") {
                    this.setState({
                        bool: "",
                    });
                    this.props.history.push("/home/" + this.state.profilename);
                } else {
                    this.setState({
                        bool: "Invalid Profilename/Password",
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    bool: "Invalid Profilename/Password",
                });
            });
    }

    render() {
        const image = {
            maxWidth: "100%",
            maxHeight: "100%",
            display: "block",
        };

        const image2 = {
            maxWidth: "100%",
            maxHeight: "100%",
            display: "block",
        };

        return (
            <div>
                <div className="split intro">
                    <img src="dd.png" style={image} />

                </div>
                <div className="split lcolumn">
                    <form onSubmit={this.handle_submit}>
                        <div className="form-group">
                            <div class="form-group row">
                                <div class="col-md-6">
                                    <h2>Login</h2>
                                    {this.state.bool}
                                    <br />
                                    <input
                                        type="text"
                                        required
                                        className="form-control"
                                        placeholder="Your Profile name"
                                        value={this.state.profilename}
                                        onChange={this.handle_pname}
                                    />
                                    <br />
                                    <input
                                        type="password"
                                        required
                                        className="form-control"
                                        placeholder="Your password"
                                        value={this.state.password}
                                        onChange={this.handle_pass}
                                    />
                                    <br />
                                    <input
                                        type="submit"
                                        className="btn btn-primary btnSubmit"
                                        value="Login"
                                    ></input>
                                    <br />
                                    <button onClick={this.handle_signup}> Create Account </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
