import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../components/Authcontext'
import { ThemeProvider } from '../components/ThemeContext'
import { AppShell } from '../components/Navbar'
import Login from '../pages/Login'
import Skills from '../pages/Skills'
import NotFound from '../pages/404'
import Cert from '../pages/Certification'
import Me from  '../pages/me'
import Project from '../pages/Project'
import Resume from '../pages/Resume'  
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<AppShell />}>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/student-me" element={<Me/>}/>
              <Route path="/home" element={<Home />} />
              <Route path="/add-project" element={<Project/>}/>
              <Route path="/upload-resume" element={<Resume />} />
              <Route path="/add-cert" element={<Cert/>}/>
              <Route path="/add-skill" element={<Skills />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
