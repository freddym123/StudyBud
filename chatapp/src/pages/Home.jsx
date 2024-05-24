import { Link, createSearchParams, useSearchParams } from "react-router-dom"
import RoomContainer from "../components/RoomContainer"
import TopicContainer from "../components/TopicContainer";
import ActivityContainer from "../components/ActivityContainer"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
export default function Home(){
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [activities, setActivities] = useState([])
    const [rooms, setRooms] = useState([]);
    const [token,] = useContext(UserContext)
    const [topics, setTopics] = useState([]);
    const [searchTopic, setSearchTopic] = useState(searchParams.get("topic") || "All")
    const [allRooms, setAllRooms] = useState(0)

    useEffect(()=>{

        async function getRooms(){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            };

            let response;
            if(searchTopic == "All"){
                response = await fetch("http://localhost:8000/rooms", options)
            }else{
                response = await fetch(`http://localhost:8000/rooms?topic=${searchTopic}`, options)
            }
        
            const topics_response = await fetch("http://localhost:8000/topics", options)
            const activities_response = await fetch("http://localhost:8000/activity", options)

            if(!response.ok || !topics_response.ok || !activities_response.ok){
                return
            }else{
                const data = await response.json()
                const topic_data = await topics_response.json()
                const activity_data = await activities_response.json()
                console.log(topic_data)
                setRooms(data)
                setTopics(topic_data)
                setActivities(activity_data)
                let sum = 0;
                for(let i = 0; i < topic_data.length; i++){
                    sum += topic_data[i].count;
                }
                setAllRooms(sum)
                console.log(data)
            }
        }
        getRooms()
    }, [searchTopic])

    function handleChangeTopic(topic){
        setSearchTopic(topic)
    }


    return (<>
    <main className="home-container">
        <div className="home-browse-topic-container">
            <h2>BROWSE TOPICS</h2>
            <TopicContainer name="All" key={"all"} count={allRooms} active={searchTopic} onclick={handleChangeTopic}></TopicContainer>
            {
                topics.map((data)=>{
                    return <TopicContainer key={data.name+data.count} name={data.name} count={data.count}
                    active={searchTopic} onclick={handleChangeTopic}></TopicContainer>
                })
            }

            <Link to="/topics">More</Link>
        </div>

        <div className="home-room-section">
        <form className="search-topic">
            <input type='text' placeholder="Search for posts"></input>
        </form>

        <div className="home-toplinks">
            <Link to="/topics">Browse Topics</Link>
            <Link to="/activity">Recent Activities</Link>
        </div>

        <div className="rooms-info-header">
            <div className="room-info">
                <h3>STUDY ROOM</h3>
                <p>7 Rooms available</p>
            </div>
            <Link className="new-room-btn" to='/create-room'>
                + Create Room
            </Link>
        </div>

        {
            rooms.map((element)=>{
                return <RoomContainer key={element._id} path_id={element._id} description={element.description}
                host={element.host_username} title={element.name} topic={element.topicName} participants={element.participants}/>
            })
        }
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