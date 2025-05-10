import { createRouter, createWebHistory } from 'vue-router'
import EquipmentListView from '@/components/EquipmentListView.vue'
import EquipmentFormView from '@/components/EquipmentFormView.vue'
import MaintenanceTaskFormView from '@/components/MaintenanceTaskFormView.vue'
import MaintenanceTaskListView from '@/components/MaintenanceTaskListView.vue'

const routes = [
  {
    path: '/',
    component: MaintenanceTaskListView,
  },
  {
    path: '/equipment',
    component: EquipmentListView,
  },
  {
    path: '/equipment/create',
    component: EquipmentFormView,
  },
  {
    path: '/equipment/edit/:id',
    component: EquipmentFormView,
    props: true,
  },
  {
    path: '/maintenance/create',
    component: MaintenanceTaskFormView,
  },
  {
    path: '/maintenance/edit/:id',
    component: MaintenanceTaskFormView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
