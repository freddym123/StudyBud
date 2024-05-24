import { Link } from "react-router-dom"
export default function TopicLink({topicname, topiccount}){
    return (<>
    <Link to={`/?topic=${topicname}`}>
    <div className="topic-container">
        <div className="topic-name">{topicname}</div>
        <div className="topic-count">{topiccount}</div>

    </div>
    </Link>
    </>)
}