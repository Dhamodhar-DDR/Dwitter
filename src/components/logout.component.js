import React, { Component } from "react";
import axios from "axios";

class Logout extends Component {
  componentDidMount() {
    axios
      .get(
        "http://localhost:7070/user/logout/" +
          this.props.match.params.profilename
      )
      .then((res) => {
        if (res.data === "Y") {
          this.props.history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return <div></div>;
  }
}

export default Logout;
