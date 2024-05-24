import ArrowLeft from '../assets/icons/arrow-left.svg?react'
import avatar from '../assets/avatar.svg'
import { Link, useParams } from 'react-router-dom'
import Message from '../components/Message'
import Participant from '../components/Participant'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useRef } from 'react'
export default function Room(){
    const params = useParams()
    const [token,] = useContext(UserContext)
    const messageContainerElement = useRef(null)
    const [topic, setTopic] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [host, setHost] = useState("")
    const [messages, setMessages] = useState([])
    const [participants, setParticipants] = useState([])
    const [userMessage, setUserMessage] = useState('')
    const socket = useRef(null)
    const firstRender = useRef(false)
    


    useEffect(()=>{
        async function get_room_info(){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                }
            }

            const response = await fetch(`http://localhost:8000/rooms/${params.id}`, options)

            if(!response.ok){
                return
            }
            const data = await response.json()
            console.log(data)
            setHost(data.host_username)
            setTitle(data.name)
            setDescription(data.description)
            setTopic(data.topicName)
            setMessages(data.messages)
            setParticipants(data.members)
        }
        get_room_info()

        const connection = new WebSocket(`ws://localhost:8000/room/ws/${params.id}`)
        connection.onmessage = (event) =>{
            const message = JSON.parse(event.data)
            setMessages((old=>[...old,message]))
        }

        socket.current = connection
    }, [params.id])

    useEffect(()=>{
        if(messages.length  && !firstRender.current){
            firstRender.current = true
            messageContainerElement.current.scrollTop = messageContainerElement.current.scrollHeight
        }
    }, [messages.length])

    function sendMessage(event){
        event.preventDefault()
        if(userMessage.trim() == ''){
            return
        }
        socket.current.send(JSON.stringify({message: userMessage, from: localStorage.getItem("chatAppUsername")}))
        setUserMessage('')
    }
    return (<>
    <main className='main-container room-main'>
        <div className='chat-area'>
            <div className='main-return-header'>
                <Link to="/"><ArrowLeft></ArrowLeft></Link>
                <h3>STUDY ROOM</h3>
            </div>

            <section className='room-info'>
                <h2>{title}</h2>
                <div className='room-owner-container'>
                    <p>HOSTED BY</p>
                    <div className='room-owner-info'>
                        <Link><img src={avatar}></img></Link>
                        <Link to={`/profile/${host}`}>@{host}</Link>
                    </div>
                </div>
                <p className='room-desc'>{description}</p>
                <div className='topic'>{topic}</div>
            </section>

            <section className='room-messages-container' ref={messageContainerElement}>
                {
                    messages.map((obj)=>{
                        return <Message key={obj.username+obj.created} username={obj.username}
                        created={obj.created} body={obj.body}></Message>
                    })
                }

                <form className='new-message-form' onSubmit={sendMessage}>
                    <input type='text' placeholder='Write your message here...' value={userMessage} onChange={(e)=>{
                        setUserMessage(e.target.value)
                    }}></input>
                </form>
            </section>

            

            
            

        </div>
        <div className='room-participants-container'>
            <div className='room-participants-header'>
                Participants 
            </div>
            {participants.map((obj)=>{
                return <Participant key={obj.username} username={obj.username} name={obj.name}></Participant>
            })}
        </div>
    </main>
    </>)
}