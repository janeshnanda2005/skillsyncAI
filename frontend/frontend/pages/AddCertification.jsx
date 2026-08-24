import { useState } from "react";
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Form,Button,Alert} from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import {useAuth} from '../components/Authcontext'

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:8000';
const API_BASE = (() => {
    try{
        return new URL(API_URL).origin;
    }
    catch{
        return API_URL.replace(/\/+$/,'');
    }
})();

function AddCert(){
    const{user} = useAuth();
    const navigate = useNavigate();
    const[title,settile] = useState('');
    const[des,Setdec] = useState('')
    const[error,Seterror] = useState('')
    const[success,Setsuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const title = (title||des).trim();

        if(!title){
            Seterror('Please enter the certificate details');
            Setsuccess('');
            return;
        }

        const token = user?.access_token;
        if(!token){
            Seterror('Please login to use the account');
            Setsuccess('');
            return;
        }
        try{
            await axios.post(
                `${API_BASE}/project/add-cert`,
                {title},
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                },
            );
        
            Setsuccess('Certificate added successfully');
            Seterror('');
            Setdec('')
            settile('');
        }
        catch(err){
            const detail = err.response?.data?.detail || 'Unable to add Certificate right now'
            Seterror(detail);
            Setsuccess('')
        }
    };

    return(
        <div className="container py-5">
            <div className="mx-auto" style={{maxWidth:'560px'}}>
                <h2 className="mb-4">Add a Project</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="skillselect">
                        <Form.Label>Enter The Certificate Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g Harvard cs50"
                            value={title}
                            onChange = {(event) => {
                                settile(event.target.value);
                            }}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="skillselect">
                        <Form.Label>Enter Certificate details</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="description of the certification"
                            value={des}
                            onChange = {(event) => {
                                settile(event.target.value);
                            }}/>
                    </Form.Group>
                    
                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" className="flex-grow-1">
                        Submit Certificate
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate('/home')}>
                        Back Home
                        </Button>
                </div>
                </Form>

            </div>
        </div>
    )
}

export default AddCert;