import {useState,useEffect,useRef} from "react"
import { useAuth } from "../components/useAuth";
import axios from "axios";


function AIChat(){

    const { user } = useAuth();
    const {input,Setinput} = useState("");
    const {messages,Setmessages} = useState("");
    const {success,Setsuccess} = useState("");
    const messagesEndRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

    const ScrollBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior:'smooth'});
    }

    useEffect(() => {
        ScrollBottom();
    },[messages,loading]);


    const handleSubmit = async(event) => {
        event.preventDefault();
        if(!user.access_token){
            Setmessages((prev) => [...prev,{
                role:'assistant',
                content:'Please Login to your account to use AI'
            }])
            return;
        }

        const usermessage = {role:'user',content:input};
        Setmessages((prev) => [...prev,usermessage]);
        Setinput("");


        try{
            const response = await axios.post(
                `${API_URL}/ai/ai-chat`,
                { msg: input },
                {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`
                    }
                }
            )
            Setresponse(memoryarray+reponse.data);
            Setinput("");
        }
        catch(err){
            SetError(`The AI Chat is not available now ${err.response?.data?.detail || err.message}`)
            Setloading(false);
            return;
        }
    }

}


export default AIChat;
