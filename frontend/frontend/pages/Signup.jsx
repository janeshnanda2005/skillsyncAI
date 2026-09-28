import { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/useAuth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', correct_password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/auth/register`, form)
      signup({ name: form.name, email: form.email, ...response.data })
      navigate('/login')
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Create your account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          {['name', 'email', 'password', 'correct_password'].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field === 'correct_password' ? 'Confirm Password' : field[0].toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type={field === 'email' ? 'email' : field === 'name' ? 'text' : 'password'}
                value={form[field]}
                onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                required
              />
            </Form.Group>
          ))}
          <Button variant="primary" type="submit" className="w-100">Sign Up</Button>
        </Form>
        <p className="mt-3 text-center mb-0">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
