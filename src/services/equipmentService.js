import axios from 'axios'

const API_URL = '/api/equipment'

export default {
  getAllEquipment() {
    return axios.get(API_URL)
  },

  getEquipmentById(id) {
    return axios.get(`${API_URL}/${id}`)
  },

  createEquipment(equipment) {
    return axios.post(API_URL, equipment)
  },

  updateEquipment(id, equipment) {
    return axios.put(`${API_URL}/${id}`, equipment)
  },

  deleteEquipment(id) {
    return axios.delete(`${API_URL}/${id}`)
  },

  getEquipmentMaintenanceTasks(id) {
    return axios.get(`${API_URL}/${id}/maintenances`)
  },

  getEquipmentsByMaintenanceTasks(maintenanceTaskId) {
    return axios.get(`${API_URL}/maintenances/${maintenanceTaskId}`)
  },

  assignMaintenanceTask(equipmentId, maintenanceId) {
    return axios.post(`${API_URL}/${equipmentId}/maintenances`, { maintenanceId })
  },

  deleteMaintenanceFromEquipment(equipmentId, maintenanceTaskId) {
    return axios.delete(`${API_URL}/${equipmentId}/maintenances/${maintenanceTaskId}`)
  },
}
