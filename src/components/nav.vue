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
        <s-icon>
          <svg viewBox="0 -960 960 960">
            <path
              d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"
            ></path>
          </svg>
        </s-icon>
      </s-icon-button>
      <s-picker-item value="zh-CN" selected>简体中文</s-picker-item>
      <s-picker-item value="en-US">English</s-picker-item>
    </s-picker>
    <s-tooltip slot="action">
      <s-icon-button slot="trigger" @click="openGithub">
        <s-icon>
          <svg data-v-afeea289="" viewBox="0 0 1024 1024">
            <path
              data-v-afeea289=""
              d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"
            ></path>
          </svg>
        </s-icon>
      </s-icon-button>
      {{ t("buttons.repo") }}
    </s-tooltip>
  </s-appbar>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

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
