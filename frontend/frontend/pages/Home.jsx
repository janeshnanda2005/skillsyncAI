import { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Home() {
  const navigate = useNavigate();
  const {user,logout} = useAuth();
  const [portfolio, setPortfolio] = useState({ skills: [], certifications: [], projects: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = user?.access_token;
    if (!token) return;

    const loadPortfolio = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [skills, certifications, projects] = await Promise.all([
          axios.get(`${API_URL}/skills/my-skills`, config),
          axios.get(`${API_URL}/certifications/my-certifications`, config),
          axios.get(`${API_URL}/projects/my-projects`, config),
        ]);
        setPortfolio({
          skills: skills.data,
          certifications: certifications.data,
          projects: projects.data,
        });
        setError('');
      } catch (err) {
        setError(err.response?.data?.detail || 'Unable to load your portfolio');
      }
    };

    loadPortfolio();
  }, [user?.access_token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }


  return (
    <div className="container py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">SkillSyncAI Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome{user?.name ? `, ${user.name}` : ''}
          </p>
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Skills</h5>
              <p className="card-text text-muted">Track your current technical skills and learning progress.</p>
              <Button onClick={() => navigate('/add-skill')}>Add Skills</Button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Projects</h5>
              <p className="card-text text-muted">Manage projects, portfolios, and recent work experience.</p>
              <Button onClick={() => navigate('/add-project')}>Add Project</Button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Resume</h5>
              <p className="card-text text-muted">Upload your current Resume for prediction</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Certifications</h5>
              <p className="card-text text-muted">Monitor certifications and verification milestones.</p>
              <Button onClick={() => navigate('/add-cert')}>Add Certificate</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Your Skills</h5>
              {portfolio.skills.length ? (
                <ul className="mb-0">
                  {portfolio.skills.map((skill) => <li key={skill.skill_id}>{skill.title}</li>)}
                </ul>
              ) : <p className="text-muted mb-0">No skills added yet.</p>}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Your Certifications</h5>
              {portfolio.certifications.length ? (
                <ul className="mb-0">
                  {portfolio.certifications.map((certification) => <li key={certification.cert_id}>{certification.title}</li>)}
                </ul>
              ) : <p className="text-muted mb-0">No certifications added yet.</p>}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Your Projects</h5>
              {portfolio.projects.length ? (
                <ul className="mb-0">
                  {portfolio.projects.map((project) => <li key={project.pid}>{project.title}</li>)}
                </ul>
              ) : <p className="text-muted mb-0">No projects added yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Home;