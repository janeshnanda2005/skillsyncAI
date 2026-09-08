import { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Cert(){
    const{user} = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        if (!user?.access_token) return;

        axios.get(`${API_URL}/certifications/my-certifications`, {
            headers: { Authorization: `Bearer ${user.access_token}` },
        })
            .then((response) => setCertificates(response.data))
            .catch((err) => setError(err.response?.data?.detail || 'Unable to load your certifications.'));
    }, [user]);


    const handleDelete = async(certId) => {
        const token = user?.access_token;
        if (!token) return;

        try {
        await axios.delete(`${API_URL}/certifications/delete-certification/${certId}`,{
            headers : {Authorization:`Bearer ${token}`},
        });
        setCertificates((current) => current.filter((cert) => cert.cert_id !== certId));
        setSuccess('Certification deleted successfully.');
        setError('');
    }
    catch (err){
        setError(err.response?.data?.detail || 'Unable to delete certification.');
        setSuccess('');
    }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const getTitle = title.trim();

        if(!getTitle){
            setError('Please enter the certification name.');
            setSuccess('');
            return;
        }

        const token = user?.access_token;
        if(!token){
            setError('Please log in before adding a certification.');
            setSuccess('');
            return;
        }

        try{
            await axios.post(
                `${API_URL}/certifications/add-cert`,
                {title},
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                },
            );
        
            setSuccess('Certification added successfully.');
            setError('');
            setTitle('');
            const response = await axios.get(`${API_URL}/certifications/my-certifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCertificates(response.data);
        }
        catch(err){
            const detail = err.response?.data?.detail || 'Unable to add certification right now.';
            setError(detail);
            setSuccess('');
        }
    };

    return(
        <div className="container py-5">
            <div className="mx-auto" style={{maxWidth:'560px'}}>
                <h2 className="mb-4">Add a Certification</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="certificationName">
                        <Form.Label>Enter The Certificate Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g Harvard cs50"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)} />
                    </Form.Group>
                    
                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" className="flex-grow-1">
                        Submit Certificate
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate('/home')}>
                        Back Home
                        </Button>
                    </div>


                    <div className="mt-4">
                        <h5>Your Certificates</h5>
                        {certificates.length === 0 ? (
                            <p className="text-muted">No certificated are added yet.</p>
                        ) : (
                            <ul className="list-group">
                                {certificates.map((cert) => (
                                    <li
                                    key = {cert.cert_id}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>{cert.title}</span>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            type="button"
                                            onClick={() => handleDelete(cert.cert_id)}>
                                                Delete
                                            </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Form>

            </div>
        </div>
    )
}

export default Cert;