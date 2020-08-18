<template>
	<div>
	<b-navbar type="dark" variant="dark">
		<b-navbar-brand href="#">Stockwatch</b-navbar-brand>
		<b-navbar-nav>
			<b-nav-item to="/dashboard" :active="isDashActive">Dashboard</b-nav-item>
			<b-nav-item to="/stocks" :active="isStocksActive">Stocks</b-nav-item>
		</b-navbar-nav>
  </b-navbar>
</div>
</template>

<script>
export default {
	name: 'NavBar',
	data() {
		console.log(this.$route.name)
		return {
			isDashActive: this.$route.name === 'Dashboard' ? true : false,
			isStocksActive: this.$route.name === 'Stock' ? true : false
		}
	}
}
</script>