import { Link } from "react-router-dom"
export default function FailAuth(){
    return(
    <main className="register-main registered-main">
            <div className="register-main-header">
                <h2>Cannot Access This Page...</h2>
            </div>
            
            <p>
                Sign In to view this page
            </p>
            <Link to="/login">Home</Link>
        </main>)
}