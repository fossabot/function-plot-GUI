<template>
  <s-appbar id="navbar">
    <s-icon-button slot="navigation" @click="emit('toggleDrawer')">
      <s-icon name="menu"></s-icon>
    </s-icon-button>
    <div slot="headline">
      <span class="nav-title">
        function-plot-GUI <span class="version"> v0.4 </span>
      </span>
    </div>

    <s-tooltip slot="action" id="themeTrigger">
      <s-icon-button slot="trigger" @click="theme.toogle">
        <SIconAutoTheme v-if="theme.index === 0" />
        <s-icon
          v-else
          :name="theme.index - 1 ? 'light_mode' : 'dark_mode'"
        ></s-icon>
      </s-icon-button>
      {{ t("buttons.toogleTheme") }}
    </s-tooltip>

    <s-picker
      slot="action"
      v-model.lazy="locale"
      id="language"
      :label="t('inputs.language')"
    >
      <s-tooltip slot="trigger">
        <s-icon-button slot="trigger">
          <SIconLanguage />
        </s-icon-button>
        {{ t("buttons.language") }}
      </s-tooltip>

      <s-picker-item value="zh-CN" selected>简体中文</s-picker-item>
      <s-picker-item value="en-US">English</s-picker-item>
    </s-picker>
    <s-tooltip slot="action">
      <s-icon-button slot="trigger" @click="openGithub">
        <SIconGtihub />
      </s-icon-button>
      {{ t("buttons.repo") }}
    </s-tooltip>
  </s-appbar>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

watch(locale, () => {
  document.documentElement.setAttribute("lang", locale.value);
  localStorage.setItem("lang", locale.value);
});

import SIconLanguage from "@/ui/icons/language.vue";
import SIconGtihub from "@/ui/icons/github.vue";
import SIconAutoTheme from "@/ui/icons/autotheme.vue";

const openGithub = () =>
  window.open("https://github.com/Linho1219/function-plot-GUI");

const emit = defineEmits(["toggleDrawer"]);

import { useTheme } from "@/states";
const theme = useTheme();
</script>

<style>
#navbar {
  box-shadow: #0005 0 0 15px;
  z-index: 9;
}

#themeTrigger s-icon {
  z-index: -1;
}

.nav-title {
  font-size: 20px;
  font-weight: bold;
}
.version {
  opacity: 0.5;
  font-size: 0.8em;
}
</style>
