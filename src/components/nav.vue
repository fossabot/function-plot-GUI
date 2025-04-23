<template>
  <div id="navbar">
    <span class="nav-title">
      function-plot-GUI <span class="version"> v0.2 · </span>
      <a
        class="link"
        href="https://github.com/Linho1219/function-plot-GUI"
        target="_blank"
        >Github</a
      >
    </span>
    <div class="grow"></div>
    <select v-model="locale" id="language">
      <option value="zh-CN">简体中文</option>
      <option value="en-US">English</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
</script>

<style>
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

#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.grow {
  flex-grow: 1;
}

#language {
  border: var(--c-border) 1px solid;
  background: var(--c-bk3);
  border-radius: 5px;
  padding: 5px 8px;
  color: var(--text);
  font-size: 15px;
}
#language:focus {
  border-color: var(--c-accent);
}
</style>
