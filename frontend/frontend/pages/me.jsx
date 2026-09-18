import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../components/useAuth";
import {Alert,Button} from 'react-bootstrap'
import axios from "axios";


const API_URL = "http://localhost:8000"

function Me(){

    const[profile, setProfile] = useState('')
    const{user,logout} = useAuth();
    const displayname = user?.name || user?.email?.split("@")[0]
    const[success,setSuccess] = useState('')
    const[error,setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {

                if(!user.access_token){
                    setError("No access token")
                    console.log("There is no access token present")
                    return;
                }
                
            try {
                const response = await axios.get(
                    `${API_URL}/students/students-me`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.access_token}`
                        }
                    }

                );
                setProfile(response.data)
                console.log(response)
                setSuccess("The data is fetched successfully from the db")
                setError('')
                
            } catch (err) {
                setError(`The profile cannot be loaded now ${err.response?.data?.detail || err.message}`)
                setSuccess('')
            }
        }

        if (user) fetchProfile()
    }, [user])


    return(<>
        <h1>Profile Page</h1>
    </>)
}

export default Me;