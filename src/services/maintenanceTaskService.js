import axios from 'axios'

const API_URL = '/api/maintenancetasks'

export default {
  getAllMaintenanceTasks() {
    return axios.get(API_URL)
  },

  getMaintenanceTaskById(id) {
    return axios.get(`${API_URL}/${id}`)
  },

  createMaintenanceTask(maintenanceTask) {
    return axios.post(API_URL, maintenanceTask)
  },

  updateMaintenanceTask(id, maintenanceTask) {
    return axios.put(`${API_URL}/${id}`, maintenanceTask)
  },

  deleteMaintenanceTask(id) {
    return axios.delete(`${API_URL}/${id}`)
  },
}
