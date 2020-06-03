import React, { Component } from "react";

function Navbar(props) {
  var home_url = "http://localhost:3000/home/" + props.profilename;
  var logout_url = "http://localhost:3000/logout/" + props.profilename;
  var notifications_url = "http://localhost:3000/notifications/" + props.profilename;
  var profile_url = "http://localhost:3000/profile/" + props.profilename + "/" + props.profilename

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
               Home
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href={notifications_url}>
              Notifications  {"      " + props.notif_num}
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="#">
              Bookmarks
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href={profile_url}>
              Profile
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href={logout_url}>
              Logout
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
