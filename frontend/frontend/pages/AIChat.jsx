import {useState,useEffect,useRef} from "react"
import { useAuth } from "../components/useAuth";
import axios from "axios";
import "./AIChat.css";


function AIChat(){

    const { user } = useAuth();
    const [input,Setinput] = useState("");
    const [messages,Setmessages] = useState([]);
    const [loading,Setloading] = useState(false);
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
        if(!input || loading) return;
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
        Setloading(true);


        try{
            const response = await axios.post(
                `${API_URL}/ai/ai-chat`,
                {msg: usermessage.content},
                {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`
                    }
                }
            )
            Setmessages((prev) => [...prev,{role:'assistant',content:response.data}]);
            Setinput("");
        }
        catch(err){
            Setmessages((prev)=> [...prev,{role:"assistant",content:err.response?.data?.detail || err.message}])
        }
        finally{
            Setloading(false);
        }
    }


    return (
        <>
        <div className="ai-chat">
        <div className="ai-chat__messages">
            {messages.map((msg, index) => (
            <div
                key={index}
                className={`ai-chat__row ${msg.role === 'user' ? 'ai-chat__row--user' : 'ai-chat__row--assistant'}`}
            >
                <div
                className={`ai-chat__message ${
                    msg.role === 'user'
                    ? 'ai-chat__message--user'
                    : 'ai-chat__message--assistant'
                }`}
                >
                {msg.content}
                </div>
            </div>
            ))}
            {loading && (
            <div className="ai-chat__row ai-chat__row--assistant">
                <div className="ai-chat__message ai-chat__message--assistant ai-chat__message--loading">
                Thinking and retrieving context...
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="ai-chat__form">
            <input
            type="text"
            value={input}
            onChange={(e) => Setinput(e.target.value)}
            placeholder="Type your question here..."
              className="ai-chat__input"
            />
            <button
            type="submit"
            disabled={loading}
              className="ai-chat__send"
            >
            Send
            </button>
        </form>
        <footer style={{textAlign:'center',marginTop:'10px'}}>
            <p>Powered by SkillsyncAI the data will be lost when you move from this page</p>
        </footer>
        </div>      
        
        
    </>)

};

export default AIChat;
