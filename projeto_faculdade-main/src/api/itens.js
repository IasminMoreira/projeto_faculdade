import api from './axios'

export async function apiListarItens(params = {}) {
  const { data } = await api.get('/itens', { params })
  return data
}

export async function apiMeusItens() {
  const { data } = await api.get('/itens/meus')
  return data
}

export async function apiCriarItem(payload) {
  const { data } = await api.post('/itens', payload)
  return data
}

export async function apiEditarItem(id, payload) {
  const { data } = await api.put(`/itens/${id}`, payload)
  return data
}

export async function apiExcluirItem(id) {
  await api.delete(`/itens/${id}`)
}

export async function apiMarcarDoado(id) {
  const { data } = await api.patch(`/itens/${id}/doado`)
  return data
}
