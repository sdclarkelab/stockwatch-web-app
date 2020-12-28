import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
// import Transaction from '../views/Transactions.vue';
// import Stocks from '../views/Stocks.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: 'Login',
        },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard - Stockwatch App',
        },
    },
    // {
    //     path: '/symbol/:symbol/transaction',
    //     name: 'Transaction',
    //     component: Transaction,
    //     meta: {
    //         title: 'Transaction - Stockwatch App',
    //     },
    // },
    // {
    //     path: '/stocks',
    //     name: 'Stocks',
    //     component: Stocks,
    //     meta: {
    //         title: 'Stocks - Stockwatch App',
    //     },
    // },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !localStorage.getItem('user')) next({ name: 'login' });
    else next();
});

export default router;
