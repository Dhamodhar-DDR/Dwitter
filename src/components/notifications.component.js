import React, { Component } from "react";
import Navbar from "./leftnavbar.component";
import axios from "axios";


const Notifications_Box = (props) => (
    <div className="notification_box" onClick={() => { props.notif_onclick(props.notifications.status) }}>
        {props.notifications.data}
        <br /><br />
    </div>
)

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.display_notifications = this.display_notifications.bind(this);
        this.notif_onclick = this.notif_onclick.bind(this);

        this.state = {
            notif_len: 0,
            notifications: [],
        }
    }

    componentDidMount() {
        axios.get("http://localhost:7070/notifications/display/" + this.props.match.params.profilename + "/" + this.state.notif_len)
            .then((res) => {
                var temp = this.state.notifications, i;
                for (i = 0; i < res.data[1].length; i++) {
                    temp.push(res.data[1][i]);
                }
                this.setState({
                    notifications: temp,
                })
            })
    }

    notif_onclick(status) {
        if (status !== null) {
            this.props.history.push("/status/" + status + "/" + this.props.match.params.profilename);
        }
    }

    display_notifications(temparr) {
        return temparr.map((curr_notif) => {
            return <Notifications_Box notifications={curr_notif} notif_onclick={this.notif_onclick} />
        })
    }

    render() {
        return (
            <div className="row" id="home_div" disabled>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <div className="column0"></div>
                <div className="column1">
                    <div className="lefnav">
                        <Navbar notif_num="" profilename={this.props.match.params.profilename} />
                    </div>
                </div>
                <div className="column2" >
                    <h5 className="Heading">Notifications</h5>
                    {this.display_notifications(this.state.notifications)}
                </div >
                <div className="column1"></div>
                <div className="column3"></div>
            </div>
        )
    }
}
export default Notifications;