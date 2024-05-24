import { Link } from "react-router-dom"
import avatar from '../assets/avatar.svg'
import UserGroup from "../assets/icons/user-group.svg?react"
export default function QueryResultItem({host, title, participants, room_id, onclick}){
    return(
        <Link className="query-item" to={`/room/${room_id}`} onClick={onclick}>
            <div>
                <div className='query-item-room-info'>
                    <img src={avatar}></img>
                    <p className='room-container-username'>@{host}</p>
                </div>
                <p className="query-item-room-title">{title}</p>
            </div>
            <div className='room-container-joined'>
                <UserGroup/>
                {participants} joined
            </div>
        </Link>
    )
}