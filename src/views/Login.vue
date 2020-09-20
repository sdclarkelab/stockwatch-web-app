<template>
    <div class="container">
        <b-form-input v-model="username" placeholder="username" />
        <b-form-input v-model="password" type="password" placeholder="password" class="mt-3" />
        <b-button class="mt-3" @click="login"> Sign In </b-button>
    </div>
</template>

<script>
import Stockwatch from '../services/stockwatchService';
import JamStockExService from '../services/jamStockExService';

export default {
    name: 'Login',
    stockwatchService: null,
    jamStockExService: null,
    data() {
        return {
            username: '',
            password: '',
        };
    },
    created() {
        this.stockwatchService = new Stockwatch();
        this.jamStockExService = new JamStockExService();
    },
    methods: {
        login() {
            this.stockwatchService
                .login({
                    username: this.username,
                    password: this.password,
                })
                .then(() => {
                    this.makeToast('Success!', 'success');
                    this.$router.push('/dashboard');
                })
                .catch(() => {
                    this.makeToast('error', 'danger');
                });
        },
        makeToast(msg, variant = null) {
            this.$bvToast.toast(msg, {
                title: 'Error login in',
                variant: variant,
                solid: true,
            });
        },
    },
};
</script>
