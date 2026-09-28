import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const emptyForm = {
    name: '',
    dept: '',
    email: '',
    year: '',
    cgpa: '',
    domain: '',
};

function StudentDetails() {
    const { user } = useAuth();
    const [form, setForm] = useState(emptyForm);
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = user?.access_token;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!token) return;

        setSaving(true);
        setError('');
        setSuccess('');

        const payload = {
            name: form.name.trim(),
            dept: form.dept.trim(),
            email: form.email.trim(),
            year: Number(form.year),
            cgpa: Number(form.cgpa),
            domain: form.domain.trim(),
        };

        if (!payload.name){
            setError("There is no name in the Form");
            setSuccess("");
            setSaving(false);
            return;
        }

        if(!payload.email){
            setError("There is no Email Address Given");
            setSuccess("");
            setSaving(false)
            return;
        }

        if(!payload.cgpa){
            setError("There is no CGPA Given");
            setSuccess("");
            setSaving(false)
            return;
        }

        if(!payload.domain){
            setError("There is no Domain Given");
            setSuccess("");
            setSaving(false)
            return;
        }
        if(!payload.dept){
            setError("There is department Given");
            setSaving(false);
            setSuccess("");
            return;
        }
        try {
            await axios.post(`${API_URL}/students/add-student-details`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Profile created successfully.');
            setForm(emptyForm);
        } catch (requestError) {
            setError(requestError.response?.data?.detail || 'Unable to save your profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="page-wrap">
            <div className="page-header">
                <div>
                    <div className="eyebrow">Student profile</div>
                    <h1>Build your student profile</h1>
                    <p>Add the information used across your skills, projects, and resume profile.</p>
                </div>
            </div>

            <form className="panel form-panel" onSubmit={handleSubmit}>
                {error && <div className="notice notice-error" role="alert">{error}</div>}
                {success && <div className="notice notice-success" role="status">{success}</div>}

                <div className="form-stack">
                    <div className="field">
                        <label htmlFor="name">Full name</label>
                        <input id="name" name="name" value={form.name} onChange={handleChange} required maxLength={50} />
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email address</label>
                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required maxLength={50} />
                    </div>

                    <div className="dashboard-grid">
                        <div className="field">
                            <label htmlFor="dept">Department</label>
                            <input id="dept" name="dept" value={form.dept} onChange={handleChange} required maxLength={10} />
                        </div>
                        <div className="field">
                            <label htmlFor="domain">Career domain</label>
                            <input id="domain" name="domain" value={form.domain} onChange={handleChange} required maxLength={50} placeholder="e.g. Software Development" />
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="field">
                            <label htmlFor="year">Study year</label>
                            <input id="year" name="year" type="number" min="2000" max="2100" value={form.year} onChange={handleChange} required />
                        </div>
                        <div className="field">
                            <label htmlFor="cgpa">CGPA</label>
                            <input id="cgpa" name="cgpa" type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="button button-primary" type="submit" disabled={saving}>
                            {saving ? 'Creating...' : 'Create profile'}
                        </button>
                        <button className="button button-primary" type="button" onClick={() => navigate('/home') }>
                            Go To Home
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}

export default StudentDetails;