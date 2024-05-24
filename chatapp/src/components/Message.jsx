import { Link } from "react-router-dom"
import avatar from "../assets/avatar.svg"
import { transform_date } from "../utils"

export default function Message({username, created, body}){
    const formatedDate = transform_date(created)
    return(<>
    <div className="message-container">
        <div className="message-container-header">
            <img src={avatar}></img>
            <Link to={`/profile/${username}`}>@{username}</Link>
            <p>{formatedDate == "" ? "Just Now" : formatedDate + " ago"}</p>
        </div>

        <p className="message-text">
            {body}
        </p>
    </div>
    </>)
}