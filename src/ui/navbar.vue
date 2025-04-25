<template>
  <s-appbar id="navbar">
    <s-icon-button slot="navigation">
      <s-icon name="menu" @click="emit('toggleDrawer')"></s-icon>
    </s-icon-button>
    <div slot="headline">
      <span class="nav-title">
        function-plot-GUI <span class="version"> v0.3 </span>
      </span>
    </div>

    <s-picker
      slot="action"
      v-model.lazy="locale"
      id="language"
      :label="t('inputs.language')"
    >
      <s-icon-button slot="trigger">
        <SIconLanguage />
      </s-icon-button>
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
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

import SIconLanguage from "@/ui/icons/language.vue";
import SIconGtihub from "@/ui/icons/github.vue";

const lang = ref("");

watchEffect(() => console.log(lang.value));

function openGithub() {
  window.open("https://github.com/Linho1219/function-plot-GUI");
}

const emit = defineEmits(["toggleDrawer"]);
</script>

<style>
#navbar {
  box-shadow: #0005 0 0 15px;
  z-index: 9;
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
