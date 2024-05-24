import React from "react";
import { Link } from "react-router-dom";

export default function Registered(){
    return(
        <main className="register-main registered-main">
            <div className="register-main-header">
                <h2>Thank you registering...</h2>
            </div>
            
            <p>
                Sign in to start rooms and chat with friends.
            </p>
            <p>Happy Chatting!</p>
            <Link to="/">Home</Link>
        </main>
    )
}