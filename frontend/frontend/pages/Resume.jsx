import { useState, useRef } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Form, Button } from 'react-bootstrap';
import { useAuth } from '../components/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


function Resume(){
    const{user} = useAuth();
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const fileInput = useRef(null);
    const [success, setSuccess] = useState('');



    const handlefilechange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile || null);
        setError('');
        setSuccess('');
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const token = user?.access_token;
        if(!token){
            setError("Please login to your account");
            return;
        }

        if(!file){
            setError('Please select a PDF file first');
            return;
        }

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setError('Only PDF files are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('file',file);

        setStatus("Uploading...");
        setError('');
        setSuccess('');

        try {
            await axios.post(
                `${API_URL}/resume/upload-resume`,
                formData,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            setStatus('');
            setSuccess("The file was added successfully");
            setFile(null);
            event.target.reset();

        }
        catch (error) {
            const detail = error.response?.data?.detail || 'Unable to upload the resume right now';
            setError(detail);
            setSuccess('');
            setStatus('');
        }
    };

    return (
            <div className="container py-5">
                <div className="mx-auto" style={{maxWidth:'500px'}}>
                    <h2 className="mb-4">Add a Resume</h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    {status && <Alert variant="info">{status}</Alert>}

                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3" controlId="resumeFile">
                                <Form.Label>Resume PDF</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    accept="application/pdf,.pdf"
                                    ref={fileInput}
                                    onChange={handlefilechange}
                                    required
                                />
                                {file && <Form.Text>{file.name}</Form.Text>}
                        </Form.Group>
                        <Button type="submit" disabled={Boolean(status)}>
                            Upload Resume
                        </Button>
                    </Form>
                </div>

            </div>
        );
}

export default Resume;