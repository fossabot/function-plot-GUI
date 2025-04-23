<template>
  <s-appbar id="navbar">
    <s-icon-button slot="navigation">
      <s-icon name="menu" @click="emit('toggleDrawer')"></s-icon>
    </s-icon-button>
    <div slot="headline">
      <span class="nav-title">
        function-plot-GUI <span class="version"> v0.2 · </span>
        <a
          class="link"
          href="https://github.com/Linho1219/function-plot-GUI"
          target="_blank"
          >Github</a
        >
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
  </s-appbar>
</template>

<script setup lang="ts">
import "sober";
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

const lang = ref("");

watchEffect(() => console.log(lang.value));

const emit = defineEmits(["toggleDrawer"]);
</script>

<style>
#navbar{
  box-shadow: #0005 0 0 15px;
  z-index:9;
}


.nav-title {
  font-size: 20px;
  font-weight: bold;
}
.version {
  opacity: 0.5;
  font-size: 0.8em;
}
.link {
  opacity: 0.5;
  font-size: 0.8em;
  text-decoration: none;
  color: var(--c-text);
}
.link:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>
