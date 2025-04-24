import { createApp } from "vue";

import i18n from "./i18n";
import "./public.css";
import App from "./App.vue";

import "sober";

const app = createApp(App);

app.use(i18n);
app.mount("#app");
