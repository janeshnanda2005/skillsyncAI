import { useState } from 'react';
import axios from 'axios';
import Dropdown from '../components/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return API_URL.replace(/\/+$/, '');
  }
})();

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

function AddSkills() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search,Setsearch] = useState('');
  const [isopen,SetIsOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('');
  const [error, setError] = useState('');
  const [showdropdown,Setshowdropdown] = useState(false)
  const [success, setSuccess] = useState('');


  const filterskills = skillOptions.filter((skill) => 
    skill.toLowerCase().includes(search.toLowerCase())
  );

  const handleselection = (skill) => {
    setSelectedSkill(skill);
    Setsearch(skill);
    SetIsOpen(false)
  }

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
        `${API_BASE}/skills/add-skill`,
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
                  onFocus={(event) => Setshowdropdown(true)}
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

        <Dropdown
          endpoint="http://localhost:5173/add-skill"
          labelText="Add Skill"
          placeholder="Add the details of the skill"
          onSelect={(id) => settile(id)}/>
      </div>
    </div>
  );
}

export default AddSkills;