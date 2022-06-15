import React, { Component } from "react";

function Navbar(props) {
  var home_url = "/home/" + props.profilename;
  var logout_url = "/logout/" + props.profilename;
  var notifications_url = "/notifications/" + props.profilename;
  var profile_url = "/profile/" + props.profilename + "/" + props.profilename

  return (
    <div>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      <nav className="navbar">
        <ul className="navbar-nav">
          <br />
          <li className="nav-item">
            <a className="nav-link" href={home_url}>
              <i style={{marginLeft : 2, float : "left"}}className="large material-icons">home</i>
              &nbsp; Home
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href={notifications_url}>
              <i style={{marginLeft : 2, float : "left"}} className="large material-icons">notifications_none</i>
              &nbsp; Notifications  {"      " + props.notif_num}
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#">
              <i style={{marginLeft : 2, float : "left"}} className="large material-icons">bookmark_border</i>
              &nbsp;&nbsp;Bookmarks
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href={profile_url}>
              <i style={{marginLeft : 2, float : "left"}} className="large material-icons">person_outline</i>
            &nbsp;&nbsp;Profile
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href={logout_url}>
              <i  style={{marginLeft : 2, float : "left"}} className="large material-icons">login</i>
              &nbsp;&nbsp;Logout
            </a>
          </li>

          {/* <div className="nav-link-pname">
            <li className="nav-item">
              <a className="nav-link" href="">
                {props.profilename}
              </a>
            </li>
          </div> */}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
