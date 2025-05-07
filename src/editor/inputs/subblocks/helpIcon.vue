<template>
  <s-tooltip>
    <SIconInfo class="help" slot="trigger" />
    <slot></slot>
  </s-tooltip>
</template>

<script setup lang="ts">
import SIconInfo from "@/ui/icons/info.vue";
</script>

<style scoped lang="scss">
.help {
  width: 1.2em;
  color: inherit;
  margin-left: 0.3em;
  cursor: help;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}
</style>
