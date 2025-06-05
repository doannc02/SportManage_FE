import React, { useState, useEffect } from "react"
import { getAppToken } from "../configs/token"

export const UserContext = React.createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user")
        //  const savedUser = getAppToken()
        return savedUser
            ? JSON.parse(savedUser)
            : {
                totalCartItems: 0,
                roles: [
                    ''
                ],
                expiresAt: ""
            }
    })

    const [search, setSearch] = useState("")

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user))
    }, [user])

    return (
        <UserContext.Provider value={{ user, setUser, search, setSearch }}>
            {children}
        </UserContext.Provider>
    )
}
