<template>
  <div>
    <h1 class="mb-4">{{ isEditing ? 'Edit Equipment' : 'Add New Equipment' }}</h1>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <form v-else @submit.prevent="saveEquipment" class="needs-validation" novalidate>
      <div class="mb-3">
        <label for="brand" class="form-label">Brand*</label>
        <input
          type="text"
          class="form-control"
          id="brand"
          v-model="form.brand"
          required
          maxlength="100"
        />
        <div class="invalid-feedback">Brand is required.</div>
      </div>

      <div class="mb-3">
        <label for="model" class="form-label">Model*</label>
        <input
          type="text"
          class="form-control"
          id="model"
          v-model="form.model"
          required
          maxlength="100"
        />
        <div class="invalid-feedback">Model is required.</div>
      </div>

      <div class="mb-3">
        <label for="equipmentType" class="form-label">Equipment Type*</label>
        <select class="form-select" id="equipmentType" v-model="form.equipmentTypeId" required>
          <option value="" disabled>Select an equipment type</option>
          <option v-for="type in equipmentTypes" :key="type.id" :value="type.id">
            {{ type.description }}
          </option>
        </select>
        <div class="invalid-feedback">Equipment Type is required.</div>
      </div>

      <div class="mb-3">
        <label for="purchaseDate" class="form-label">Purchase Date*</label>
        <input
          type="date"
          class="form-control"
          id="purchaseDate"
          v-model="form.purchaseDate"
          required
        />
        <div class="invalid-feedback">Purchase Date is required.</div>
      </div>

      <div class="mb-3">
        <label for="serialNumber" class="form-label">Serial Number</label>
        <input
          type="text"
          class="form-control"
          id="serialNumber"
          v-model="form.serialNumber"
          maxlength="100"
        />
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          <span
            v-if="submitting"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isEditing ? 'Update' : 'Create' }}
        </button>
        <router-link to="/equipment" class="btn btn-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import equipmentService from '@/services/equipmentService'
import equipmentTypeService from '@/services/equipmentTypeService'

export default {
  name: 'EquipmentFormView',
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
    const equipmentTypes = ref([])

    const form = ref({
      id: 0,
      brand: '',
      model: '',
      equipmentTypeId: '',
      purchaseDate: '',
      serialNumber: '',
    })

    const formatDateForInput = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    }

    const loadEquipmentTypes = async () => {
      try {
        const response = await equipmentTypeService.getAllEquipmentTypes()
        equipmentTypes.value = response.data
      } catch (error) {
        console.error('Error loading equipment types:', error)
        alert('Failed to load equipment types. Please try again.')
      }
    }

    const loadEquipment = async () => {
      if (!props.id) {
        loading.value = false
        return
      }

      try {
        const response = await equipmentService.getEquipmentById(props.id)
        const equipment = response.data
        form.value = {
          ...equipment,
          purchaseDate: formatDateForInput(equipment.purchaseDate),
        }
      } catch (error) {
        console.error('Error loading equipment:', error)
        alert('Failed to load equipment data. Please try again.')
        router.push('/equipment')
      } finally {
        loading.value = false
      }
    }

    const validateForm = () => {
      const form = document.querySelector('.needs-validation')
      if (!form.checkValidity()) {
        event.stopPropagation()
        form.classList.add('was-validated')
        return false
      }
      return true
    }

    const saveEquipment = async () => {
      if (!validateForm()) return

      submitting.value = true
      try {
        if (isEditing.value) {
          await equipmentService.updateEquipment(props.id, form.value)
        } else {
          await equipmentService.createEquipment(form.value)
        }
        router.push('/equipment')
      } catch (error) {
        console.error('Error saving equipment:', error)
        alert('Failed to save equipment. Please try again.')
      } finally {
        submitting.value = false
      }
    }

    onMounted(async () => {
      await Promise.all([loadEquipmentTypes(), loadEquipment()])
    })

    return {
      saveEquipment,
      form,
      equipmentTypes,
      loading,
      submitting,
      isEditing,
    }
  },
}
</script>
