<template>
  <div class="home">
    <h1 class="mb-4">Maintenance Tasks</h1>

    <div class="d-flex justify-content-between mb-3">
      <router-link to="/maintenance/create" class="btn btn-primary"> Add New Task </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="maintenanceTasks.length === 0" class="alert alert-info">
      No maintenance tasks found. Click "Add New Task" to create one.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in maintenanceTasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.description }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <router-link :to="`/maintenance/edit/${task.id}`" class="btn btn-outline-primary">
                  Edit
                </router-link>
                <button @click="confirmDelete(task)" class="btn btn-outline-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmationModal
      title="Delete Maintenance Task"
      message="Are you sure you want to delete this maintenance task?"
      @confirmed="deleteTask"
      ref="confirmModal"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import maintenanceTaskService from '@/services/maintenanceTaskService'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

export default {
  name: 'MaintenanceTaskListView',
  components: {
    ConfirmationModal,
  },
  setup() {
    const maintenanceTasks = ref([])
    const loading = ref(true)
    const confirmModal = ref(null)
    const taskToDelete = ref(null)

    const loadTasks = async () => {
      try {
        loading.value = true
        const response = await maintenanceTaskService.getAllMaintenanceTasks()
        maintenanceTasks.value = response.data
      } catch (error) {
        console.error('Error loading maintenance tasks:', error)
        alert('Failed to load maintenance tasks. Please try again.')
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = (task) => {
      taskToDelete.value = task
      confirmModal.value.show()
    }

    const deleteTask = async () => {
      if (!taskToDelete.value) return

      try {
        await maintenanceTaskService.deleteMaintenanceTask(taskToDelete.value.id)
        await loadTasks() // Reload the list
      } catch (error) {
        if (error.status == 409)
          // TODO make toast
          alert('Cannot delete maintenance tasks with assigned equipments.')
        else {
          console.error('Error deleting maintenance task:', error)
          alert('Failed to delete maintenance task. Please try again.')
        }
      }
    }

    onMounted(() => {
      loadTasks()
    })

    return {
      maintenanceTasks,
      loading,
      confirmModal,
      confirmDelete,
      deleteTask,
    }
  },
}
</script>
