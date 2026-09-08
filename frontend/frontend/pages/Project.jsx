import { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../components/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


function Project(){
    const{user} = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!user?.access_token) return;

        axios.get(`${API_URL}/projects/my-projects`, {
            headers: { Authorization: `Bearer ${user.access_token}` },
        })
            .then((response) => setProjects(response.data))
            .catch((err) => setError(err.response?.data?.detail || 'Unable to load your projects.'));
    }, [user]);


    const handleDelete = async (projectId) => {
        const token = user?.access_token;
        if(!token) return;

        try{
            await axios.delete(`${API_URL}/projects/delete-project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects((current) => current.filter((project) => project.pid !== projectId));
            setSuccess('Project deleted successfully.');
            setError('');
        }
        catch(err){
            setError(err.response?.data?.detail || 'Unable to delete the project.');
            setSuccess('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const get_title = title.trim();
        const getDescription = description.trim();


        if(!get_title){
            setError('Please enter the project title.');
            setSuccess('');
            return;
        }

        if(!getDescription){
            setError('Please enter the description.');
            setSuccess('');
            return;
        }

        const token = user?.access_token;
        if(!token){
            setError('Please log in before adding a project.');
            setSuccess('');
            return;
        }
        try{
            await axios.post(
                `${API_URL}/projects/add-project`,
                { title: get_title, description: getDescription },
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                },
            );
            
            setSuccess('Project added successfully.');
            setError('');
            setDescription('');
            setTitle('');
            const response = await axios.get(`${API_URL}/projects/my-projects`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(response.data);
        }
        catch(err){
            const detail = err.response?.data?.detail || 'Unable to add Project right now'
            setError(detail);
            setSuccess('');
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
                        <Form.Label>Enter The Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g AI app"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="skillselect">
                        <Form.Label>Enter The Project Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="description of the product"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)} />
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" className="flex-grow-1">
                        Submit project
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate('/home')}>
                        Back Home
                        </Button>
                    </div>

                    <div className="mt-4">
                        <h5>Your Projects</h5>
                        {projects.length === 0 ? (
                            <p className="text-muted">No projects added yet</p>
                        ) : (
                            <ul className="list-group">
                                {projects.map((project) => (
                                    <li 
                                    key={project.pid}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>
                                            <strong>{project.title}</strong>
                                            <br />
                                            <small className="text-muted">{project.description}</small>
                                        </span>
                                        <Button 
                                            variant="outline-danger"
                                            size="sm"
                                            type="button"
                                            onClick={() => handleDelete(project.pid)}>
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

export default Project;