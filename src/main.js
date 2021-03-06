import Vue from 'vue';
import App from './App.vue';
import router from './router';
import moment from 'moment';

Vue.config.productionTip = false;
import PrimeVue from 'primevue/config';

Vue.use(PrimeVue);

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import 'primeflex/primeflex.css';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressBar from 'primevue/progressbar';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

Vue.component('DataTable', DataTable);
Vue.component('Column', Column);
Vue.component('ProgressBar', ProgressBar);
Vue.component('Toolbar', Toolbar);
Vue.component('Button', Button);
Vue.component('FileUpload', FileUpload);
Vue.component('ColumnGroup', ColumnGroup);
Vue.component('Row', Row);
Vue.component('Dialog', Dialog);
Vue.component('InputNumber', InputNumber);
Vue.component('Dropdown', Dropdown);

import messageService from './services/messageService';

Vue.prototype.$messageService = new messageService();

import { ToastPlugin } from 'bootstrap-vue';
Vue.use(ToastPlugin);

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumIntegerDigits: 2,
});

Vue.filter('currency', function (value) {
    if (Number.isFinite(parseFloat(value)) == false || Number.isNaN(value)) {
        return '$0.00';
    }
    value = parseFloat(value);
    return formatter.format(value);
});

Vue.filter('percent', function (value) {
    if (!value || Number.isNaN(value)) {
        return `${0}%`;
    }
    return ((Number(value) * 100) / 100).toFixed(2) + '%';
});

Vue.filter('date', function (value) {
    return moment(value).format('DD-MM-YYYY');
});

export const app = new Vue({
    render: (h) => h(App),
    router,
}).$mount('#app');
