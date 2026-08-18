import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Authcontext';

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container py-4">
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
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Projects</h5>
              <p className="card-text text-muted">Manage projects, portfolios, and recent work experience.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Certifications</h5>
              <p className="card-text text-muted">Monitor certifications and verification milestones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;