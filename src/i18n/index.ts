import type { createI18n } from "vue-i18n";
type I18nOpt = Parameters<typeof createI18n>[0];

const locale = (() => {
  if (localStorage) {
    const localLocale = localStorage.getItem("lang");
    const langStr = localLocale ?? navigator.language;
    if (langStr.startsWith("zh")) return "zh-CN";
    if (langStr.startsWith("en")) return "en-US";
  }
  return "en-US";
})();

if (localStorage && !localStorage.getItem("lang"))
  localStorage.setItem("lang", locale);

import zhCN from "./zh-CN.json";
import enUS from "./en-US.json";

export type I18nSchema = typeof zhCN;
export type I18nLang = "zh-CN" | "en-US";

export const i18nData = {
  legacy: false,
  locale,
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
} satisfies I18nOpt;
