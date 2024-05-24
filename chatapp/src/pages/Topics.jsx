import { useEffect, useState } from "react"
import ArrowLeft from "../assets/icons/arrow-left.svg?react"
import TopicLink from "../components/TopicLink"
import { Link } from "react-router-dom"
export default function Topics(){
    const [topics, setTopics] = useState([])
    
    useEffect(()=>{
        async function get_topics(){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const topics_response = await fetch("http://localhost:8000/topics", options)
            const topic_data = await topics_response.json()
            setTopics(topic_data)
        }
        get_topics()
    }, [])
    
    return (
        <>
        <main className="topic-main">
            <div className="topics-search-container">
                <div className="topics-search-header">
                    <Link to="/"><ArrowLeft></ArrowLeft></Link>
                    <h2>BROWSE TOPICS</h2>
                </div>
            </div>

            <form>
                <input type="text" placeholder="Search for topics"></input>
            </form>

            <div className="topics-container">
                {
                    topics.map(topic=>{
                        return <TopicLink topicname={topic.name} topiccount={topic.count} key={topic.name}/>
                    })
                }
            </div>
        </main>
        </>
    )
}