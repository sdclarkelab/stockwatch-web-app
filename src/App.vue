<template>
    <div>
        <nav-bar />
        <div id="app">
            <div class="mt-5">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
    name: 'App',
    components: {
        NavBar,
    },
    watch: {
        $route(to) {
            document.title = to.meta.title || 'Your Website';
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
