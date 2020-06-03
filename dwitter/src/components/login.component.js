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
    return (
      <div>
        <div className="back_img">
        </div>
        <div className="back_img2">
          <div className="component">
            <h2>Login</h2>
            <form onSubmit={this.handle_submit}>
              <div className="form">
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
                <input type="submit" className="btn btn-primary btnSubmit" value="Login"></input>
                <br />
                <a href="http://localhost:3000/signup" > Create Account </a>
              </div>
            </form>
          </div>
        </div>

      </div>
    );
  }
}

export default Login;
