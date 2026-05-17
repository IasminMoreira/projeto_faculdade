import api from './axios'
import axios from 'axios'

// Pega o cookie CSRF antes de qualquer mutação
async function csrf() {
  await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
}

export async function apiLogin(email, senha) {
  await csrf()
  const { data } = await api.post('/login', { email, password: senha })
  return data.user
}

export async function apiRegistrar(nome, email, senha) {
  await csrf()
  const { data } = await api.post('/register', {
    name: nome,
    email,
    password: senha,
    password_confirmation: senha,
  })
  return data.user
}

export async function apiLogout() {
  await api.post('/logout')
}

export async function apiUsuarioAtual() {
  const { data } = await api.get('/user')
  return data
}
