import { Link } from 'react-router-dom'
import avatar from '../assets/avatar.svg'
import RoomContainer from '../components/RoomContainer.jsx'
import ActivityContainer from '../components/ActivityContainer.jsx'
import TopicContainer from '../components/TopicContainer.jsx'
import ProfileTopicContainer from "../components/ProfileTopicContainer.jsx"
import { useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext.jsx'


export default function Profile(){
    const [rooms, setRooms] = useState([])
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [topics, setTopics] = useState([])
    const [activities, setActivities] = useState([])
    const params = useParams()
    const [token, ] = useContext(UserContext)
    const [activeTopic, setActiveTopic] = useState("All")
    useEffect(()=>{
        async function getProfile(){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer "+token
                }
            }
            const response = await fetch(`http://localhost:8000/users?username=${params.username}`, options)
            const activity_response = await fetch("http://localhost:8000/activity", options)


            if(!response.ok || !activity_response.ok){
                return
            }
            const data = await response.json()
            const activity_data = await activity_response.json()
            console.log(data)
            console.log(activity_data)
            setActivities(activity_data)
            setRooms(data.rooms)
            setName(data.name)
            setUsername(data.username)
            setTopics(data.topics)
        }
        getProfile()
    }, [params.username])

    return (<>
    <main className="profile-main">
    <div className="home-browse-topic-container">
            <h2>BROWSE TOPICS</h2>
            <ProfileTopicContainer key="all" name="All" active={activeTopic} count={rooms.length} onclick={(topic)=>{setActiveTopic(topic)}}></ProfileTopicContainer>
            {
                topics.map((value)=>{
                    return <ProfileTopicContainer key={value.name} active={activeTopic} name={value.name} count={value.count} onclick={(topic)=>{setActiveTopic(topic)}}></ProfileTopicContainer>
                })
            }
        </div>

        <div className='profile-user-information'>
            <div className="profile-header">
                <img src={avatar}></img>
                <h2>{name}</h2>
                <Link to={`/profile/${username}`}><p>@{username}</p></Link>
                <Link  to="/edit-user" className='edit-profile-link'>Edit Profile</Link>
            </div>

            <section>
                <h3>ABOUT</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores corrupti veniam tempora sunt delectus earum blanditiis culpa maxime tempore debitis, reprehenderit atque, qui ut modi ducimus consectetur minus quisquam. Ratione.
                </p>
            </section>

            <section>
                <h3>STUDY ROOMS HOSTED BY {username}</h3>
                {
                    activeTopic == "All" ? (rooms.map((value)=>{
                        return <RoomContainer key={value._id} description={value.description}
                        host={value.host_username} title={value.name} topic={value.topicName} path_id={value._id} participants={value.count}></RoomContainer>
                    })) : (
                        rooms.filter((room)=>room.topicName==activeTopic).map((roomObj)=>{
                            return <RoomContainer key={roomObj._id} description={roomObj.description}
                            host={roomObj.host_username} title={roomObj.name} topic={roomObj.topicName} path_id={roomObj._id} participants={roomObj.count}></RoomContainer>
                        })
                    )
                }
            </section>

        </div>
    
        <div className="home-recent-activities-container">
            <div className="recent-activities-header">
                <h2>RECENT ACTIVITIES</h2>
            </div>
            {
                activities.map((obj)=>{
                    return <ActivityContainer key={obj.created+obj.username} username={obj.username}
                    room={obj.room_name} date={obj.created} message={obj.body} room_id={obj.room_id}></ActivityContainer>
                })
            }
        </div>

    </main>
    </>)
}