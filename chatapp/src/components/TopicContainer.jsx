import { Link } from "react-router-dom"
export default function TopicContainer({name, count, active,onclick}){
    return(<>
    <Link to={name=="All" ? "/" : `/?topic=${name}`} className={`topic-browse-container ${active==name ? 'active': ''}`}
    data-name={name} onClick={()=>{onclick(name)}}>
        <p className="topic-name">{name}</p>
        <div className="topic-room-count">{count}</div>
    </Link>
    </>)
}