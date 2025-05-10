<template>
  <div
    class="modal fade"
    id="confirmationModal"
    tabindex="-1"
    aria-labelledby="confirmationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmationModalLabel">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="confirm">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'

export default {
  name: 'ConfirmationModal',
  props: {
    title: {
      type: String,
      default: 'Confirm',
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?',
    },
  },
  emits: ['confirmed'],
  setup(props, { emit }) {
    const modal = ref(null)

    onMounted(() => {
      modal.value = new bootstrap.Modal(document.getElementById('confirmationModal'))
    })

    const show = () => {
      if (modal.value) {
        modal.value.show()
      }
    }

    const hide = () => {
      if (modal.value) {
        modal.value.hide()
      }
    }

    const confirm = () => {
      emit('confirmed')
      hide()
    }

    return {
      show,
      hide,
      confirm,
    }
  },
}
</script>
