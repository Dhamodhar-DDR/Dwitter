import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/signup.component";
import Login from "./components/login.component";
import Home from "./components/homepage.component";
import Logout from "./components/logout.component";
import Profiles from "./components/profile.component";
import Status from "./components/status.component";
import Notifications from "./components/notifications.component";

function App() {
  return (
    <div className="container-fluid">
      <Router>

        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Login} />
        <Route path="/logout/:profilename" component={Logout} />
        <Route path="/home/:profilename" component={Home} />
        <Route path="/status/:belike/:profilename" component={Status} />
        <Route path="/notifications/:profilename" component={Notifications} />
        <Route path="/profile/:profilename/:searchval" component={Profiles} />

      </Router>
    </div>
  );
}

export default App;
