<template>
  <s-tooltip @click.stop>
    <SIconWarn v-if="props.type === 'warn'" class="help warn" slot="trigger" />
    <SIconInfo v-else class="help" slot="trigger" />
    <slot></slot>
  </s-tooltip>
</template>

<script setup lang="ts">
import SIconInfo from "@/ui/icons/info.vue";
import SIconWarn from "@/ui/icons/warn.vue";

const props = defineProps<{
  type?: "info" | "warn";
}>();
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

  &.warn {
    color: var(--s-color-warning);
    animation:
      bouncein var(--s-motion-duration-medium4)
        var(--s-motion-easing-emphasized),
      breathe 2s infinite;
  }
}
</style>
