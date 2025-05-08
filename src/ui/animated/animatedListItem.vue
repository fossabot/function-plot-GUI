<template>
  <div class="animatedListItem" :class="props.class">
    <div class="animatedListItemInner" :class="props.classInner">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  class?: string;
  classInner?: string;
}>();
</script>

<style lang="scss" scoped>
.animatedListItem {
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;
  transition: grid-template-rows var(--s-motion-duration-short4, 0.2s)
    var(--s-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
}
.animatedListItemInner {
  min-height: 0;
}
.list-trans {
  &-enter-from,
  &-leave-to {
    grid-template-rows: 0fr;
  }
}
</style>
