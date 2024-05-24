import logo from '../assets/logo.svg'
import avatar from '../assets/avatar.svg'
import { Link } from 'react-router-dom'
import DownArrow from '../assets/icons/chevron-down.svg?react'
import Logout from "../assets/icons/sign-out.svg?react"
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import QueryResultItem from './QueryResultItem'

export default function Nav(){
    const [displayDropDown, setDisplayDropDown] = useState(false)
    const [token, setToken] = useContext(UserContext)
    const [q, setQ] = useState("")
    const [searchTabs, setSearchTabs] = useState([])

    useEffect(()=>{
        if(q == ""){
            setSearchTabs([])
            return
        }
        const timeout = setTimeout(async ()=>{
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            }
            const response = await fetch(`http://localhost:8000/rooms?q=${q}`, options)
            const data = await response.json()
            console.log(data)
            setSearchTabs(data)

        }, 1000)

        return ()=>{clearTimeout(timeout)}
    }, [q])

    function handleLogout(){
        setToken(null)
        setDisplayDropDown(false)
    }

    function resetSearchForm(){
        setSearchTabs([])
        setQ("")
    }

    return(
        <>
        <nav>
            <div className='nav-container'>
            <Link to="/">
            <div className="logo">
                <img src={logo}></img>
                <h2>StudyBuddy</h2>
            </div>
            </Link>

            <div className='search-form-container'>
                <form className="nav-form">
                    <input type='text' placeholder="Search for posts" value={q} onChange={(e)=>{setQ(e.target.value)}}></input>
                </form>
                <div className='query-result-container'>
                    {
                        searchTabs.map((room)=>{
                            return <QueryResultItem key={room._id} host={room.host_username} title={room.name} participants={room.participants} room_id={room._id} onclick={resetSearchForm}/>
                        })
                    }
                </div>
            </div>
            

            {
                token != null ? 
                (<div className='user-login user-signin'>
                <Link to={`/profile/${localStorage.getItem("chatAppUsername")}}`}><img src={avatar}></img></Link>
                <div className='nav-username-name'>
                    <Link to={`/profile/${localStorage.getItem("chatAppUsername")}`}>@{localStorage.getItem("chatAppUsername")}</Link>
                </div>
                <DownArrow onClick={(e)=>{setDisplayDropDown(!displayDropDown)}}/>
                {displayDropDown && (<div className='drop-down'>
                    <button onClick={handleLogout}><Logout/>Logout</button>
                </div>)}
            </div>)
                : (<div className='user-login'>
                    <a><img src={avatar}></img></a>
                    <Link to="/login"><button>Login</button></Link>
                  </div>)
            }
            </div>
            

        </nav>
        </>
    )
}