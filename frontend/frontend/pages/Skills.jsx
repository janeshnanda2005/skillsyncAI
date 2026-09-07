import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


const skillOptions = [
  // Programming Languages
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'C',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Kotlin',
  'Swift',
  'R',
  'MATLAB',
  'Scala',
  'Dart',
  'Perl',
  'Shell Scripting',
  'Bash',

  // Frontend
  'HTML',
  'CSS',
  'React',
  'Next.js',
  'Angular',
  'Vue.js',
  'Svelte',
  'Redux',
  'Tailwind CSS',
  'Bootstrap',
  'Material UI',
  'jQuery',

  // Backend
  'Node.js',
  'Express.js',
  'FastAPI',
  'Django',
  'Flask',
  'Spring Boot',
  'ASP.NET',
  'Laravel',
  'Ruby on Rails',
  'REST API',
  'GraphQL',
  'WebSockets',

  // Databases
  'SQL',
  'MySQL',
  'PostgreSQL',
  'SQLite',
  'Oracle Database',
  'MongoDB',
  'Redis',
  'Cassandra',
  'Firebase',
  'DynamoDB',
  'Elasticsearch',

  // AI / Machine Learning
  'Machine Learning',
  'Deep Learning',
  'Artificial Intelligence',
  'Natural Language Processing',
  'Computer Vision',
  'Generative AI',
  'Large Language Models',
  'PyTorch',
  'TensorFlow',
  'Keras',
  'Scikit-learn',
  'Pandas',
  'NumPy',
  'Matplotlib',
  'OpenCV',
  'Hugging Face',
  'LangChain',
  'LangGraph',
  'YOLO',
  'CNN',
  'RNN',
  'Transformers',
  'Reinforcement Learning',

  // Data Science / Big Data
  'Data Analysis',
  'Data Science',
  'Data Visualization',
  'Power BI',
  'Tableau',
  'Apache Spark',
  'Hadoop',
  'Apache Kafka',
  'ETL',
  'Data Engineering',

  // Cloud
  'AWS',
  'Microsoft Azure',
  'Google Cloud Platform',
  'AWS EC2',
  'AWS S3',
  'AWS Lambda',
  'AWS RDS',
  'Azure Functions',
  'Google Cloud Functions',

  // DevOps / Tools
  'Git',
  'GitHub',
  'GitLab',
  'Docker',
  'Kubernetes',
  'Jenkins',
  'GitHub Actions',
  'CI/CD',
  'Terraform',
  'Ansible',
  'Linux',
  'Nginx',

  // Mobile Development
  'React Native',
  'Flutter',
  'Android Development',
  'iOS Development',

  // Testing
  'Unit Testing',
  'Integration Testing',
  'PyTest',
  'Jest',
  'Selenium',
  'Postman',

  // Core Computer Science
  'Data Structures',
  'Algorithms',
  'Object-Oriented Programming',
  'Operating Systems',
  'Computer Networks',
  'Database Management Systems',
  'System Design',
  'Multithreading',
  'Distributed Systems',
  'Microservices',
  'RESTful Architecture',

  // Cybersecurity
  'Cybersecurity',
  'Network Security',
  'Authentication',
  'Authorization',
  'JWT',
  'OAuth',

  // Other Development Skills
  'Web Development',
  'Backend Development',
  'Frontend Development',
  'Full Stack Development',
  'API Development',
  'Software Development',
  'Agile',
  'Scrum',
  'JIRA',
];

function Skills() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState('');
  const [error, setError] = useState('');
  const [showdropdown,Setshowdropdown] = useState(false)
  const [success, setSuccess] = useState('');
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (!user?.access_token) return;

    axios.get(`${API_URL}/skills/my-skills`, {
      headers: { Authorization: `Bearer ${user.access_token}` },
    })
      .then((response) => setSkills(response.data))
      .catch((err) => setError(err.response?.data?.detail || 'Unable to load your skills.'));
  }, [user]);

    const handleDelete = async(skillId) => {
      const token = user?.access_token;
      if(!token) return;

      try{
        await axios.delete(`${API_URL}/skills/delete-skill/${skillId}`,{
          headers: {Authorization:`Bearer ${token}`},
        });
          setSkills((currentSkills) => currentSkills.filter((skill) => skill.skill_id !== skillId));
          setSuccess("Skill deleted successfully");
          setError('')
      }
      catch(err){
        setError(err.response?.data?.detail||'Unable to delete the skill right now');
        setSuccess('');
      }
    };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = (selectedSkill).trim();
    console.log(title);
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
      const response = await axios.get(`${API_URL}/skills/my-skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(response.data);
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
              <div className='position-relative'>
                <Form.Control
                  type = "text"
                  placeholder="type or search the skill"
                  value={selectedSkill}
                  onFocus={() => Setshowdropdown(true)}
                  onChange={(event)=>{
                    setSelectedSkill(event.target.value);
                    Setshowdropdown(true);
                  }}  
                  />
                  {showdropdown && (
                    <div className="skill-dropdown">
                      {skillOptions
                          .filter((skill) => 
                              skill.toLowerCase().includes(selectedSkill.toLowerCase())
                              
                            )
                            .map((skill) => (
                              <div
                                key = {skill}
                                className='skill-option'
                                onClick={()=>{
                                  setSelectedSkill(skill);
                                  Setshowdropdown(false);

                                }}
                                >
                                  {skill}
                                </div>
                            ))}
                      
                    </div>

                  )}
              </div>
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

        <div className="mt-4">
          <h5>Your Skills</h5>
          {skills.length === 0 ? (
            <p className="text-muted">No skills added yet.</p>
          ) : (
            <ul className="list-group">
              {skills.map((skill) => (
                <li
                  key={skill.skill_id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{skill.title}</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    onClick={() => handleDelete(skill.skill_id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
          
      </div>
    </div>
  );
}

export default Skills;