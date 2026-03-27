import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ FIXED
  headers: { 'Content-Type': 'application/json' },
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ac_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // ❗ TEMP: do NOT auto logout (prevents redirect loop while debugging)
    if (err.response?.status === 401) {
      console.log('❌ Unauthorized request:', err.response?.data)
      // localStorage.removeItem('ac_token') ❌ REMOVE THIS
      // window.location.href = '/login'     ❌ REMOVE THIS
    }
    return Promise.reject(err)
  }
)

export default api