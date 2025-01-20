import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

let Vue = createApp(App);
Vue.use(router);
Vue.mount("#app");
