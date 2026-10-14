import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://skillsyncai-d5pk.onrender.com'

export async function loginAdmin(email, password){
    const response = await axios.post(`${API_URL}/admin/login`, { email, password })
    return response.data
}

