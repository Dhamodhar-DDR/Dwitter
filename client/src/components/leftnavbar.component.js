import React, { Component } from "react";

function Navbar(props) {
  var home_url = "/home/" + props.profilename;
  var logout_url = "/logout/" + props.profilename;
  var notifications_url = "/notifications/" + props.profilename;
  var profile_url = "/profile/" + props.profilename + "/" + props.profilename

  const image = {
    height: "5%",
  }
  return (
    <div>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      <nav class="navbar">
        <ul class="navbar-nav">
          <br />
          <li class="nav-item">
            <a class="nav-link" href={home_url}>
              <i className="large material-icons">home</i>
              &nbsp; Home
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href={notifications_url}>
              <i className="large material-icons">notifications_none</i>
              &nbsp; Notifications  {"      " + props.notif_num}
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="#">
              <i className="large material-icons">bookmark_border</i>
              &nbsp;&nbsp;Bookmarks
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href={profile_url}>
              <i className="large material-icons">person_outline</i>
            &nbsp;&nbsp;Profile
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href={logout_url}>
              <i className="large material-icons">login</i>
              &nbsp;&nbsp;Logout
            </a>
          </li>

          <div className="nav-link-pname">
            <li class="nav-item">
              <a class="nav-link" href="">
                {props.profilename}
              </a>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
