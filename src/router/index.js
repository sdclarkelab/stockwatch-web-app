import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Transaction from '../views/Transactions.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/symbol/:symbol/transaction',
    name: 'Transaction',
    component: Transaction
  },
]

const router = new VueRouter({
  routes
})


export default router
