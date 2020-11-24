<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand href="#"> Stockwatch </b-navbar-brand>
            <b-navbar-nav>
                <b-nav-item to="/dashboard" :active="isDashActive"> Dashboard </b-nav-item>
                <b-nav-item to="/stocks" :active="isStocksActive"> Stocks </b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-button variant="dark" :active="isDashActive" @click="logout"> Logout </b-button>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import Stockwatch from '../../services/stockwatchService';

export default {
    name: 'NavBar',
    stockwatchService: null,
    created() {
        this.stockwatchService = new Stockwatch();
    },
    data() {
        console.log(this.$route.name);
        return {
            isDashActive: this.$route.name === 'Dashboard' ? true : false,
            isStocksActive: this.$route.name === 'Stock' ? true : false,
        };
    },
    methods: {
        logout() {
            this.stockwatchService
                .logout()
                .then(() => {
                    this.$router.push('/login');
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>
