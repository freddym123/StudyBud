import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import FailAuth from "../pages/FailAuth"

export default function RequireAuth({children}){
    const [token, ] = useContext(UserContext)
    if(token == null || token == "null"){
        return <FailAuth></FailAuth>
    }

    return(
        children
    )
}