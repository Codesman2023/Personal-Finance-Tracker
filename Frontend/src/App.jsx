import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/login.jsx'
import Dashboard from './components/dashboard.jsx'
import Register from './components/register.jsx'
import UserProtectWrapper from './components/UserProtectWrapper.jsx'
import Home from './components/home.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>} /> 
      <Route path="/dashboard" element={
        <UserProtectWrapper>
          <Dashboard />
        </UserProtectWrapper>
      } />
    </Routes>
  )
}

export default App