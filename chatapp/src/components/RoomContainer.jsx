import { Link } from 'react-router-dom'
import avatar from '../assets/avatar.svg'
import UserGroup from "../assets/icons/user-group.svg?react"
export default function RoomContainer({path_id, description,host, title, topic, participants}){
    return(<>
    <div className="room-container">
        <div className="room-container-header">
            <Link to={`/profile/${host}`}>
            <div className='room-container-userinfo'>
                <img src={avatar}></img>
                <p className='room-container-username'>@{host}</p>
            </div>
            </Link>

            <div>18 hours, 22 minutes ago</div>
        </div>

        <div className='room-container-title'>
            <Link to={`/room/${path_id}`}><h2>{title}</h2></Link>
            <p className='roomContainer-desc'>
                {description}
            </p>
        </div>

        


        

        <div className="room-container-footer">
            <Link to={`/room/${path_id}`}>
            <div className='room-container-joined'>
                <UserGroup/>
                {participants} joined
            </div>
            </Link>
            <div className="topic-name">{topic}</div>
        </div>
    </div>
    </>)
}