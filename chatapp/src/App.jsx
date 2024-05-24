import { useState } from 'react'
import Nav from './components/nav'
import {Outlet, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Topics from './pages/Topics'
import Activity from './pages/Activity'
import Register from './pages/Register'
import CreateRoom from './pages/CreateRoom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Room from './pages/Room'
import EditUser from './pages/EditUser'
import Registered from './pages/Registered'
import RequireAuth from './components/RequireAuth'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nav></Nav>
    <Routes>
      <Route path="/" element={<RequireAuth><Home></Home></RequireAuth>}></Route>
      <Route path="/topics" element={<RequireAuth><Topics/></RequireAuth>}></Route>
      <Route path='/activity' element={<RequireAuth><Activity></Activity></RequireAuth>}></Route>
      <Route path='/register' element={<Register></Register>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/room' element={<RequireAuth><Outlet></Outlet></RequireAuth>}>
        <Route path=":id" element={<Room></Room>}></Route>
      </Route>
      <Route path='/create-room' element={<RequireAuth><CreateRoom></CreateRoom></RequireAuth>}></Route>
      <Route path='/profile/:username' element={<RequireAuth><Profile></Profile></RequireAuth>}></Route>
      <Route path='/edit-user/' element={<RequireAuth><EditUser></EditUser></RequireAuth>}></Route>
      <Route path="/registered" element={<Registered></Registered>}></Route>
    </Routes>
      
    </>
  )
}

export default App
