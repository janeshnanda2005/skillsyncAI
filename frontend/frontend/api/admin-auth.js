import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function loginAdmin(email, password){
    const response = await axios.post(`${API_URL}/admin/admin-login`, { email, password })
    return response.data
}

