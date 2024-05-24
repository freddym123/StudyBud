import { Link } from 'react-router-dom'
import BackBtn from '../assets/icons/arrow-left.svg?react'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
export default function CreateRoom(){
    const [token,] = useContext(UserContext)
    const [errorMsg, setErrorMsg] = useState('')
    const [displayError, setDisplayError] = useState(false)
    const [topic, setTopic] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [topics, setTopics] = useState([])

    useEffect(()=>{
        async function getTopics(){
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }

            const response = await fetch("http://localhost:8000/topics", options)
            const data = await response.json()
            setTopics(data)
        }
        getTopics()
    }, [])

    async function handleSubmit(e){
        e.preventDefault()
        if(topic == '' || title == ''){
            setErrorMsg("Missing a required field")
            setDisplayError(true)
            return
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({name: title, topic: topic, description: description})
        }

        const response = await fetch("http://localhost:8000/rooms", options)

        if(!response.ok){
            console.log("Something went wrong")
            return
        }
        console.log("Created room sucessfully")
        setDescription('')
        setTitle('')
        setTopic('')
    }


    return (<>
    <main className="register-main">
        <div className="register-main-header room-main-header">
            <Link to="/"><BackBtn></BackBtn></Link>
            <h2>CREATE/UPDATE STUDY ROOM</h2>
        </div>

        <form className="register-form" onSubmit={handleSubmit} onChange={()=>{setDisplayError(false)}}>
            <label htmlFor="topic-name">Enter a Topic</label>
            <input id="topic-name" name="topic-name" type='text' list="topic-list" value={topic} onChange={(e)=>{setTopic(e.target.value)}}></input>
            <datalist id="topic-list">
                <select>
                    {
                        topics.map((data)=><option key={data.name} value={data.name}>{data.name}</option>)
                    }
                </select>
            </datalist>

            <label htmlFor="room-name">Room Name</label>
            <input id="room-name" name="room-name" type='text' value={title} onChange={(e)=>{setTitle(e.target.value)}}></input>

            <label htmlFor="room-description">Room Description</label>
            <textarea id="room-description" name="room-description" value={description} onChange={(e)=>{setDescription(e.target.value)}}></textarea>

            <p className='form-error' style={{display: displayError? 'block' : 'none'}}>{errorMsg}</p>

            <div className="room-form-btns">
                <Link to="/"><button className="cancel-btn">Cancel</button></Link>
                <button type='submit'>Submit</button>
            </div>
            
        </form>
    </main>
    </>)
}