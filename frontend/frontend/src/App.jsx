import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../components/Authcontext'
import Login from '../pages/Login'
import AddSkills from '../pages/AddSkills'
import AddCert from '../pages/AddCertification'
import AddProject from '../pages/AddProject'
import AddResume from '../pages/AddResume'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-project" element={<AddProject/>}/>
          <Route path="/upload-resume" element={<AddResume />} />
          <Route path="/add-cert" element={<AddCert/>}/>
          <Route path="/add-skill" element={<AddSkills />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
