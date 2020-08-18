import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Transaction from '../views/Transactions.vue'
import Stocks from '../views/Stocks.vue'

Vue.use(VueRouter)

const routes = [
    { 
        path: '/', 
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard - Stockwatch App'
        }
    },
    {
        path: '/symbol/:symbol/transaction',
        name: 'Transaction',
        component: Transaction,
        meta: {
            title: 'Transaction - Stockwatch App'
        }
    },
    {
        path: '/stocks',
        name: 'Stocks',
        component: Stocks,
        meta: {
            title: 'Stocks - Stockwatch App'
        }
    },
]

const router = new VueRouter({
  routes
})


export default router
