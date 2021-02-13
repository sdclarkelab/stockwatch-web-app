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
import NavBar from './components/common/NavBar.vue';

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
.status-badge {
    border-radius: 2px;
    padding: 0.25em 0.5rem;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.3px;
}

.status-badge.status-1 {
    background-color: #c8e6c9;
    color: #256029;
}

.status-badge.status-2 {
    background-color: #ffcdd2;
    color: #c63737;
}

.status-badge.status-3 {
    background-color: #b3e5fc;
    color: #23547b;
}
</style>
