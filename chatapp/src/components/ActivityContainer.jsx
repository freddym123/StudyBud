import { Link } from 'react-router-dom'
import avatar from '../assets/avatar.svg'
import { transform_date } from '../utils'
import { useEffect } from 'react'
export default function ActivityContainer({username,
    room, date, message, room_id}){

    return (<>
    <div className="activity-container">
        <div className="activity-container-header">
            <div className='activity-container-userinfo'>
                <img src={avatar} className='activity-profile-img'></img>
                <div>
                    <Link to={`/profile/${username}`}>
                        <p className='username'>@{username}</p></Link>
                    <p className='ago'>{transform_date(date)} ago</p>
                </div>
            </div>
            <div>X</div>
        </div>

        <div className='activity-container-reply'>replied to post <Link to={`/room/${room_id}`}>"{room}"</Link></div>

        <div className='activity-container-message'>
            {message}
        </div>
    </div>
    </>)
}