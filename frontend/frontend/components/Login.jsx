import axios from 'axios';

const API_URL = "https:///"

export const Login = async(email,password) => {
    try{
        const response = await axios.post(`${API_URL}/users`,{email,password});
        return response.data;
    } catch(error){
        throw error;
    }
};




import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors,setErrors] = useState('');


    const Validateform = () =>{
        const newErrors = {};
        if (!email) newErrors.email= 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is required";
        if(!password) newErrors.password= 'password is required';
        else if (password.length < 6) newErrors.password = 'password must be atleast 6 characters long';
        return newErrors
    }; 


    const handleSubmit = (event) => {
        event.preventDefault()
        const formerror = Validateform();
        if(Object.keys(formerror).length > 0){
            setErrors(formerror);
        }
        else{
            setErrors({});
            console.log("Login attemptes with: ",{email,password})
        }
    }

    return (
        <>
            <div className="login-wrappper">
                    <div className="login-form-container">
                        <h2 className="login-title">Login</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} isInvalid ={!!errors.email} onChange={(e) => setEmail(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    {error.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} isInvalid={!!errors.password}  onChange={(e) => setPassword(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>
                    </div>
            </div>
        </>
    )
}

export default Login