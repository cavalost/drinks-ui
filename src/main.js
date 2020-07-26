import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { ClientTable } from "vue-tables-2";
import * as VueGoogleMaps from "vue2-google-maps";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(ClientTable, {}, false, "bootstrap4");

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GMAPS_TOKEN,
    libraries: "places"
  },
  installComponents: true
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
