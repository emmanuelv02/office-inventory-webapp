<template>
  <div>
    <h1 class="mb-4">Equipment List</h1>

    <div class="d-flex justify-content-between mb-3">
      <router-link to="/equipment/create" class="btn btn-primary"> Add New Equipment </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="equipment.length === 0" class="alert alert-info">
      No equipment found. Click "Add New Equipment" to create one.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Equipment Type</th>
            <th>Purchase Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in equipment" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.brand }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.equipmentTypeDescription }}</td>
            <td>{{ formatDate(item.purchaseDate) }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <router-link :to="`/equipment/edit/${item.id}`" class="btn btn-outline-primary">
                  Edit
                </router-link>
                <button @click="confirmDelete(item)" class="btn btn-outline-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmationModal
      title="Delete Equipment"
      :message="deleteMessage"
      @confirmed="deleteEquipment"
      ref="confirmModal"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import equipmentService from '@/services/equipmentService'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

export default {
  name: 'EquipmentListView',
  components: {
    ConfirmationModal,
  },
  setup() {
    const equipment = ref([])
    const loading = ref(true)
    const confirmModal = ref(null)
    const equipmentToDelete = ref(null)
    const deleteMessage = ref('Are you sure you want to delete this equipment?')

    const loadEquipment = async () => {
      try {
        loading.value = true
        const response = await equipmentService.getAllEquipment()
        equipment.value = response.data
      } catch (error) {
        console.error('Error loading equipment:', error)
        alert('Failed to load equipment data. Please try again.')
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = async (item) => {
      equipmentToDelete.value = item

      try {
        // Check if equipment has maintenance tasks
        const response = await equipmentService.getEquipmentMaintenanceTasks(item.id)
        if (response.data && response.data.length > 0) {
          deleteMessage.value = 'This equipment has associated maintenance tasks. Delete it anyway?'
        } else {
          deleteMessage.value = 'Are you sure you want to delete this equipment?'
        }
        confirmModal.value.show()
      } catch (error) {
        console.error('Error checking maintenance tasks:', error)
        deleteMessage.value = 'Are you sure you want to delete this equipment?'
        confirmModal.value.show()
      }
    }

    const deleteEquipment = async () => {
      if (!equipmentToDelete.value) return

      try {
        await equipmentService.deleteEquipment(equipmentToDelete.value.id)
        await loadEquipment() // Reload the list
      } catch (error) {
        console.error('Error deleting equipment:', error)
        if (error.response && error.response.status === 400) {
          alert('Cannot delete equipment because it has associated maintenance tasks.')
        } else {
          alert('Failed to delete equipment. Please try again.')
        }
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }

    onMounted(() => {
      loadEquipment()
    })

    return {
      equipment,
      loading,
      confirmModal,
      deleteMessage,
      confirmDelete,
      deleteEquipment,
      formatDate,
    }
  },
}
</script>
