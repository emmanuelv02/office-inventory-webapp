<template>
  <div>
    <h1 class="mb-4">{{ isEditing ? 'Edit Maintenance Task' : 'Add New Maintenance Task' }}</h1>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <form v-else @submit.prevent="saveMaintenanceTask" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="id" class="form-label">ID</label>
        <input
          type="text"
          class="form-control"
          id="id"
          v-model="form.id"
          disabled
          placeholder="ID will be assigned automatically"
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description*</label>
        <input
          type="text"
          class="form-control"
          id="description"
          v-model="form.description"
          required
        />
        <div class="invalid-feedback">Description is required.</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Assigned Equipment*</label>
        <div class="mb-2" v-if="selectedEquipment.length === 0">
          <div class="alert alert-info">At least one equipment must be selected.</div>
        </div>
        <div class="mb-2" v-if="selectedEquipment.length > 0">
          <p class="mb-2">Selected Equipment:</p>
          <div class="list-group">
            <div
              v-for="equipment in selectedEquipment"
              :key="equipment.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ equipment.brand }} - {{ equipment.model }}</strong>
                <div class="text-muted small">{{ equipment.equipmentTypeDescription }}</div>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="removeEquipment(equipment.id)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="mb-2">
          <p class="mb-2">Add Equipment:</p>
          <div class="input-group">
            <select class="form-select" v-model="selectedEquipmentId">
              <option value="" disabled>Select equipment</option>
              <option
                v-for="equipment in availableEquipment"
                :key="equipment.id"
                :value="equipment.id"
              >
                {{ equipment.brand }} - {{ equipment.model }} ({{
                  equipment.equipmentTypeDescription
                }})
              </option>
            </select>
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="addEquipment"
              :disabled="!selectedEquipmentId"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting || selectedEquipment.length === 0"
        >
          <span
            v-if="submitting"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isEditing ? 'Update' : 'Create' }}
        </button>
        <router-link to="/" class="btn btn-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import maintenanceTaskService from '@/services/maintenanceTaskService'
import equipmentService from '@/services/equipmentService'

export default {
  name: 'MaintenanceTaskFormView',
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  setup(props) {
    const router = useRouter()

    const isEditing = computed(() => !!props.id)
    const loading = ref(true)
    const submitting = ref(false)
    const allEquipment = ref([])
    const selectedEquipment = ref([])
    const selectedEquipmentId = ref('')

    const form = ref({
      id: null,
      description: '',
      equipmentIds: [],
    })

    const availableEquipment = computed(() => {
      // Filter out equipment that's already selected
      const selectedIds = selectedEquipment.value.map((e) => e.id)
      return allEquipment.value.filter((e) => !selectedIds.includes(e.id))
    })

    const loadEquipment = async () => {
      try {
        const response = await equipmentService.getAllEquipment()
        allEquipment.value = response.data
      } catch (error) {
        console.error('Error loading equipment:', error)
        alert('Failed to load equipment data. Please try again.')
      }
    }

    const loadMaintenanceTask = async () => {
      if (!props.id) {
        loading.value = false
        return
      }

      try {
        // Load the maintenance task
        const taskResponse = await maintenanceTaskService.getMaintenanceTaskById(props.id)
        form.value = taskResponse.data

        // Load associated equipment
        const equipResponse = await equipmentService.getEquipmentsByMaintenanceTasks(props.id)
        selectedEquipment.value = equipResponse.data || []
      } catch (error) {
        console.error('Error loading maintenance task:', error)
        alert('Failed to load maintenance task data. Please try again.')
        router.push('/')
      } finally {
        loading.value = false
      }
    }

    const addEquipment = () => {
      if (!selectedEquipmentId.value) return

      const equipment = allEquipment.value.find((e) => e.id == selectedEquipmentId.value)
      if (equipment) {
        selectedEquipment.value.push(equipment)
        selectedEquipmentId.value = ''
      }
    }

    const removeEquipment = (equipmentId) => {
      selectedEquipment.value = selectedEquipment.value.filter((e) => e.id !== equipmentId)
    }

    const validateForm = () => {
      const form = document.querySelector('.needs-validation')
      if (!form.checkValidity()) {
        event.stopPropagation()
        form.classList.add('was-validated')
        return false
      }

      if (selectedEquipment.value.length === 0) {
        alert('Please select at least one equipment.')
        return false
      }

      return true
    }

    const saveMaintenanceTask = async () => {
      if (!validateForm()) return

      submitting.value = true
      try {
        // let taskId

        // Save the maintenance task
        form.value.equipmentIds = selectedEquipment.value.map((x) => x.id)

        if (isEditing.value) {
          await maintenanceTaskService.updateMaintenanceTask(props.id, form.value)
          //   taskId = props.id
        } else {
          form.value.id = 0
          /* const response =*/ await maintenanceTaskService.createMaintenanceTask(form.value)
          //   taskId = response.data.id
        }

        // Assign the equipment to the task
        /*  for (const equipment of selectedEquipment.value) {
          try {
            await equipmentService.assignMaintenanceTask(equipment.id, taskId)
          } catch (error) {
            console.error(`Error assigning equipment ${equipment.id} to task:`, error)
          }
        }*/

        router.push('/')
      } catch (error) {
        console.error('Error saving maintenance task:', error)
        alert('Failed to save maintenance task. Please try again.')
      } finally {
        submitting.value = false
      }
    }

    onMounted(async () => {
      await Promise.all([loadEquipment(), loadMaintenanceTask()])
    })

    return {
      form,
      allEquipment,
      selectedEquipment,
      selectedEquipmentId,
      availableEquipment,
      loading,
      submitting,
      isEditing,
      addEquipment,
      removeEquipment,
      saveMaintenanceTask,
    }
  },
}
</script>
