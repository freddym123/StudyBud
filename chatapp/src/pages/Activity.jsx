import { useContext, useEffect, useState } from "react"
import ArrowLeft from "../assets/icons/arrow-left.svg?react"
import ActivityContainer from "../components/ActivityContainer"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext"
export default function Activity(){
    const [activities, setActivities] = useState([])
    const [token,] = useContext(UserContext)
    useEffect(()=>{
        async function get_activities(){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            }
            const response = await fetch("http://localhost:8000/activity", options)

            if(!response.ok){
                return
            }
            const data = await response.json()
            setActivities(data)
        }
        get_activities()
    }, [])
    return (<>
    <main className="activity-main">
            <div className="topics-search-container">
                <div className="topics-search-header">
                    <Link to="/"><ArrowLeft></ArrowLeft></Link>
                    <h2>RECENT ACTIVITIES</h2>
                </div>
            </div>

            <div className="activities-container">
                {
                    activities.map((obj)=>{
                        return <ActivityContainer key={obj.created+obj.username} username={obj.username}
                        room={obj.room_name} date={obj.created} message={obj.body}></ActivityContainer>
                    })
                }
            </div>
        </main>
    </>)
}