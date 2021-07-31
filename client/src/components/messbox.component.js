import React from "react"

function Mess_box(props) {
    return (
        <div >
            < div className="mess_box" onClick={() => props.handle_messbox_onClick(props.message[2])} >
                <div style={{}}>
                    <br />
                    <img style={props.DP} src={props.propic} />
                    <h5 className="M_Box_name">{props.message[0]}</h5>
                    <p className="mess_content">{props.message[1].content}</p>
                    <br />
                </div>
            </div >
            <label class="container">
                <input type="checkbox" id={props.message[2]} checked={props.check_like} onClick={() => props.likefun(props.message[2], props.message[3])} />
                <span class="checkmark1">
                    <i class="material-icons">favorite_border</i>
                </span>
            </label>
            <div className="options">
                <div className="like_count">{props.message[1].likes.length}</div>
                <a class="button" href={"#" + "com_id" + props.message[2]}><i class="material-icons">chat_bubble_outline</i></a>
                <div id={"com_id" + props.message[2]} class="overlay">
                    <div class="popup">
                        <p style={{ color: "rgba(0,0,0,0.5)" }}>Replying to {props.message[0]}</p>
                        <img style={props.DP} src={props.propic} />
                        <h2>{props.message[0]}</h2>
                        <a class="close" href="#">&times;</a>
                        <div class="content">
                            <p className="mess_content">{props.message[1].content}</p>
                            <img style={props.DP} src={require("./CSS/def_dp.png")} />
                            <div onChange={(e) => props.handle_comments2(e)}>
                                <textarea rows="5" cols="45" placeholder="Reply" >
                                </textarea>
                            </div>
                            <button onClick={() => props.handle_comments(props.message[2])}>Reply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default Mess_box;