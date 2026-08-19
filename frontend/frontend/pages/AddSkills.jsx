import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const skillOptions = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'React',
  'Node.js',
  'FastAPI',
  'Django',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'Git',
  'Docker',
  'AWS',
  'Azure',
];

function AddSkills() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = (customSkill || selectedSkill).trim();

    if (!title) {
      setError('Please select or enter a skill.');
      setSuccess('');
      return;
    }

    const token = user?.access_token;
    if (!token) {
      setError('Please log in before adding a skill.');
      setSuccess('');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/skills/add-skill`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess('Skill added successfully.');
      setError('');
      setSelectedSkill('');
      setCustomSkill('');
    } catch (err) {
      const detail = err.response?.data?.detail || 'Unable to add skill right now.';
      setError(detail);
      setSuccess('');
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '560px' }}>
        <h2 className="mb-4">Add a Skill</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="skillSelect">
            <Form.Label>Select a skill</Form.Label>
            <Form.Select
              value={selectedSkill}
              onChange={(event) => {
                setSelectedSkill(event.target.value);
                if (event.target.value) setCustomSkill('');
              }}
            >
              <option value="">Choose a skill</option>
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="customSkill">
            <Form.Label>Or type your own skill</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Machine Learning"
              value={customSkill}
              onChange={(event) => {
                setCustomSkill(event.target.value);
                if (event.target.value.trim()) setSelectedSkill('');
              }}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" className="flex-grow-1">
              Submit Skill
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/home')}>
              Back Home
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddSkills;