import "sober";
import "./public.scss";

import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia);

import { createI18n } from "vue-i18n";
import i18nData from "./i18n";
const i18n = createI18n(i18nData);
app.use(i18n);

app.mount("#app");
