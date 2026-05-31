import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./registerServiceWorker";

let Vue = createApp(App);
Vue.use(router);
Vue.mount("#app");
