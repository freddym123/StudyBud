import { useAsyncError, useNavigate } from 'react-router-dom'
import Lock from '../assets/icons/lock.svg?react'
import { useState } from 'react'
import { redirect } from 'react-router-dom'

export default function Register(){
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState('')
    const [displayError, setDisplayError] = useState(false)

    const navigate = useNavigate()

    async function submitForm(e){
        e.preventDefault()
        if(name == '' || username == '' || password == '' || confirmation == ''){
            setError("Missing required field")
            setDisplayError(true)
            return
        }

        if(password != confirmation){
            setError("Password do not match");
            setDisplayError(true)
            return
        }

        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "username": username,
                "name": name,
                "password": password
            })
        }

        const response = await fetch("http://localhost:8000/register", options)

        const data = await response.json();

        if(!response.ok){
            setError("Username is already taken")
            setDisplayError(true)
            return
        }

        navigate("/registered")
        
        console.log(data)
        
    }

    return (<>
    <main className="register-main">
        <div className="register-main-header">
            <h2>Register</h2>
        </div>

        <h2 className="register-desc">Find your study partner</h2>

        <form className="register-form" onSubmit={submitForm} onChange={()=>{setDisplayError(false)}}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type='text' value={name} onChange={(e)=>setName(e.target.value)}></input>

            <label htmlFor="username">Username</label>
            <input id="username" name="username" type='text' value={username} onChange={(e)=>setUsername(e.target.value)}></input>

            <label htmlFor="password">Password</label>
            <input id="password" name="password" type='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>

            <label htmlFor="confirmation">Password confirmation</label>
            <input id="confirmation" name="confirmation" type='password' value={confirmation} onChange={(e)=>setConfirmation(e.target.value)}></input>

            <p className='form-error' style={{display: displayError? 'block' : 'none'}}>{error}</p>
            <button type='submit'><Lock></Lock> Register</button>
        </form>
    </main>
    </>)
}