import React, {createContext, useEffect, useState} from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("chatappToken"));

    useEffect(()=>{
        const fetchUser = async ()=>{
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            }

            const response = await fetch("http://localhost:8000/users/me", options)

            if(!response.ok){
                setToken(null);
            }
            localStorage.setItem("chatappToken", token)
        }

        fetchUser();
    }, [token])

    return (
        <UserContext.Provider value={[token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )
}

