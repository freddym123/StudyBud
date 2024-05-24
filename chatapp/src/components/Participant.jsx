import Avatar from "../assets/avatar.svg"
import { Link } from "react-router-dom"
export default function Participant({username, name}){
    return (<>
    <div className="participant-container">
        <img src={Avatar}></img>
        <div>
            <p>{name}</p>
            <Link to={`/profile/${username}`}>@{username}</Link>
        </div>
    </div>
    </>)
}