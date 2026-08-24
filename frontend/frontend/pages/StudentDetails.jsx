import {useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Button} from 'react-bootstrap';
import {Link,useNavigate} from 'react-router-dom'
import {useAuth} from '../components/Authcontext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const studentdata = async ({ name, department, email, year }) => {
    const response = await axios.post(`${API_URL}/add-data`, {
        name,
        department,
        email,
        year,
    });
    return response.data;
};


function StudentData(){
    const[name,setname] = useState('');
    const[dept,SetDept] = useState('');
    const[email,SetEmail] = useState('');
    const[year,Setyear] = useState('');
    const[error,Seterror] = useState('');
    const[success,Setsuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const get_name = name.trim();
        const get_dept = dept.trim();
        const get_email = email.trim();
        if (!get_name){
            Seterror('Please enter a valid name');
            Setsuccess('');
            return;
        }

        if(!get_dept){
            Seterror('Please enter the department');
            Setsuccess('');
            return;
        }

        if(!get_email){
            Seterror('Please enter the correct email');
            Setsuccess('');
            return;
        }
        

        const token = user?.access_token;
        if(!token){
            Seterror('');
            Setsuccess('');
            return;
        }


        try{
            await axios.post(
                `$${API_URL}/studentdetails`,
                {title},
                {
                    headers:{
                        Authorization:`Bearer ${token}`,    
                    },
                },
            );
            const data = await studentdata(name,department,email,year);

            Setsuccess('Student Detail added successfully')
            Seterror('');
            Navigate('/home');
        }
        catch(error){
            const detail = error.response?.data?.detail || 'Unable toadd the skill right now';
            Seterror(detail);
            Setsuccess('')
        }
    }

    return(
    <>
        
        
        
    </>)



}

export default StudentData;