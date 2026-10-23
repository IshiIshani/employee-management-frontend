
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const employeeService = {
  getAll() {
    return api.get('/employees')
  },

  getById(id) {
    return api.get(`/employees/${id}`)
  },

  create(data) {
    return api.post('/employees', data)
  },

  update(id, data) {
    return api.put(`/employees/${id}`, data)
  },

  delete(id) {
    return api.delete(`/employees/${id}`)
  },
}

export default employeeService
