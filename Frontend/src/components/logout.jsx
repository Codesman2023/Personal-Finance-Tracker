import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Logout = () => {
  const [UserName, setUserName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.data && res.data.user && res.data.user.fullname) {
          setUserName(`${res.data.user.fullname.firstname} ${res.data.user.fullname.lastname}`)
        }
      } catch (err) {
        setUserName('')
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/login");
    }
    })
  }

  return (
    <div>
      <p>Welcome, {UserName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout