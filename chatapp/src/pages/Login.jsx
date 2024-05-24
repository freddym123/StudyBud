import { Link, useNavigate } from 'react-router-dom'
import Lock from '../assets/icons/lock.svg?react'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
export default function Login(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [displayError, setDisplayError] = useState(false)
    const [,setToken] = useContext(UserContext)

    const navigate = useNavigate()

    async function submitForm(e){
        e.preventDefault()

        if(username == '' || password == ''){
            setErrorMsg("Missing required field")
            setDisplayError(true)
            return
        }

        const options = {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: JSON.stringify(
                `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
            )
        }

        const response = await fetch("http://localhost:8000/token", options)
        const data = await response.json()

        if(!response.ok){
            setErrorMsg("Invalid username or password")
            setDisplayError(true)
            return
        }

        setToken(data.access_token)
        localStorage.setItem("chatAppUsername", username)

        navigate("/")



    }

    return (<>
    <main className="register-main">
        <div className="register-main-header">
            <h2>Login</h2>
        </div>

        <h2 className="register-desc">Find your study partner</h2>

        <form className="register-form" onSubmit={submitForm} onChange={()=>{setDisplayError(false)}}>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type='text' value={username} onChange={(e)=>setUsername(e.target.value)}></input>

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>

            { displayError && <p className='form-error'>{errorMsg}</p>}

            <button type='submit'><Lock></Lock> Login</button>

            <div className='sign-up'>
                <p>Haven't signed up yet?</p>
                <Link to="/register">Sign Up</Link>
            </div>
        </form>
    </main>
    </>)
}