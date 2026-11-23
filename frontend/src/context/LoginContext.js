import { createContext, useState, useContext, useEffect } from "react";


const loginContext = createContext();

export const LoginProvider = ({children}) =>{

    const [username, setUsername] = useState(()=>{
        return localStorage.getItem("username") || null
    });


    useEffect(()=>{
        if (username) {
            localStorage.setItem("username",username);
        } else {
            localStorage.removeItem("username");
        }
    },[username]);

    return (
        <loginContext.Provider value={{username, setUsername}}>
            {children}
        </loginContext.Provider>
    );

};



export const useLogin = () => useContext(loginContext);
