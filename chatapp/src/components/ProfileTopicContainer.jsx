import { Link } from "react-router-dom"
export default function ProfileTopicContainer({name, count, active,onclick}){
    return(<>
    <a className={`topic-browse-container ${active==name ? 'active': ''}`} onClick={()=>{onclick(name)}}>
        <p className="topic-name">{name}</p>
        <div className="topic-room-count">{count}</div>
    </a>
    </>)}