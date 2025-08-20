import React from 'react'
import { createContext, useState } from 'react'


export const UserDataContext = createContext()

const userContext = ({children}) => {

    const [user, setUser] = useState({
        email: '',
        FullName:{
            firstName: '',
            lastName: ''
        }
        
    })

  return (
    <div>
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>

    </div>
  )
}

export default userContext