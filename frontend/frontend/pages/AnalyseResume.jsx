import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../components/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function AnalyseResume(){

  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, Setmessages] = useState([]);
  const [loading, Setloading] = useState(false);
  const messagesEndRef = useRef(null);


    const scrollbottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollbottom();
    },[messages,loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!input.trim() || loading) return;
        if (!user?.access_token) {
          Setmessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'Please log in before analyzing your resume.' }
          ]);
          return;
        }

        const usermessage = {role:'user',content:input};
        Setmessages((prev) => [...prev,usermessage])
        setInput('');
        Setloading(true);

        try{
          const response = await axios.post(`${API_URL}/resume/gist-model`,{
            msg: usermessage.content
            },{
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${user?.access_token}`
            }
            });

           Setmessages((prev) => [...prev,{role:'assistant',content:response.data}]);
        }
        catch(error){
           console.error('Error Communicating with the RAG backend',error);
           Setmessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: error.response?.data?.detail || 'Could not get a response from the RAG model.'
            }
           ]);
        }finally {
            Setloading(false);
        }
        
    };


    return (
    <>
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-lg shadow-sm border border-gray-200">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 p-3 rounded-lg text-sm animate-pulse">
              Thinking and retrieving context...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
    
    
    
    </>)



}

export default AnalyseResume;