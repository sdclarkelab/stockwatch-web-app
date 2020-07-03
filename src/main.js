import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

Vue.component('DataTable', DataTable);
Vue.component('Column', Column);


new Vue({
  render: h => h(App),
}).$mount('#app')
