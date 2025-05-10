import axios from 'axios'

const API_URL = '/api/equipmenttype'

export default {
  getAllEquipmentTypes() {
    return axios.get(API_URL)
  },
}
