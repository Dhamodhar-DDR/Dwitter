import React, { Component } from "react";
import axios from "axios";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.handle_submit = this.handle_submit.bind(this);
    this.handle_pname = this.handle_pname.bind(this);
    this.handle_name = this.handle_name.bind(this);
    this.handle_pass = this.handle_pass.bind(this);
    this.state = {
      name: "",
      profilename: "",
      password: "",
      pnameflag: "",
    };
  }
  handle_name(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handle_pname(e) {
    this.setState({
      profilename: e.target.value,
    });
    
    axios.get("/api/user/get_all").then((res) => {
      console.log(res.data)
      if (res.data.length > 0) {
        console.log(res);
        var users = res.data.map((user) => user.profilename);
      }
      var i = 0;
      for (i; i < res.data.length; i++) {
        if (users[i] === this.state.profilename) {
          this.setState({
            pnameflag: "This profile name is already taken",
          });
          break;
        }
      }
      if (i === res.data.length) {
        this.setState({
          pnameflag: "",
        });
      }
    });
  }
  handle_pass(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handle_submit(e) {
    e.preventDefault();

    const user = {
      name: this.state.name,
      profilename: this.state.profilename,
      password: this.state.password,
      profilepic: require("./CSS/def_dp.png")
    };
    if (this.state.pnameflag !== "This profile name is already taken") {
      axios
        .post("/api/user/signup", user)
        .then(() => {
          console.log("User Created");
          this.props.history.push("/login");
        })
        .catch((err) => console.log("Error: " + err));
    }
  }
  render() {
    const mystyle = {
      float: "left",
      width: "120%",
      color: "white",
      backgroundColor: "#0066ff",
      padding: "10px",
      fontFamily: "Arial",
    };
    const heading = {
      fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif",
      fontWeight: "bold",
    };
    const middle = {
      float: "left",
      marginLeft: "30%",
    };
    return (
      <div style={middle}>
        <span className="align-middle">
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="card" style={mystyle}>
            <div className="card-body">
              <h3 style={heading}>Create your account</h3>
              <form onSubmit={this.handle_submit}>
                <div className="form-group">
                  <div className="form-group row">
                    <div className="col-xs-4">
                      <label>Name</label>
                      <br />
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={this.state.name}
                        onChange={this.handle_name}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-group row">
                    <div className="col-xs-4">
                      <label>Profile Name</label>
                      <br />
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={this.state.profilename}
                        onChange={this.handle_pname}
                      />{" "}
                      {this.state.pnameflag}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-group row">
                    <div className="col-xs-4">
                      <label>Password</label>
                      <br />
                      <input
                        type="password"
                        required
                        className="form-control"
                        value={this.state.password}
                        onChange={this.handle_pass}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    className="btn btn-success"
                    color="green"
                    value="Create Account"
                  />
                </div>
              </form>
            </div>
          </div>
        </span>
      </div>
    );
  }
}

export default Signup;
