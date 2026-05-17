import axios from 'axios'

const api = axios.create({
  baseURL: '/api',          // proxy do Vite → http://localhost:8000/api
  withCredentials: true,    // envia o cookie de sessão do Sanctum
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Antes de qualquer POST/PUT/DELETE busca o cookie CSRF do Sanctum
api.interceptors.request.use(async (config) => {
  const metodosSeguros = ['get', 'head', 'options']
  if (!metodosSeguros.includes(config.method)) {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
  }
  return config
})


export default api
