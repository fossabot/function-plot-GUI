<template>
  <div class="filled-textfield" :class="{ focus: isFocus }">
    <label :class="{ lifted: isFocus || !isEmpty }">{{ props.label }}</label>
    <input
      @focus="isFocus = true"
      @blur="isFocus = false"
      type="text"
      v-model="value"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const value = defineModel<string>({ required: true });
const props = defineProps<{
  label: string;
}>();
const isFocus = ref(false);
const isEmpty = computed(() => value.value === "");
</script>

<style lang="scss">
.filled-textfield {
  background-color: var(--s-color-surface-container-high);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: var(--s-color-outline) solid 0.15em;
  transition:
    background-color 0.2s,
    border-bottom-color 0.2s;
  padding: 1em 0.6em 0.3em 0.6em;
  display: flex;
  &.focus {
    background-color: var(--s-color-surface-container-highest);
    border-bottom-color: var(--s-color-primary);
    label {
      color: var(--s-color-primary);
    }
  }
  input {
    background-color: transparent;
    border: none;
    outline: none;
    font-size: inherit;
    font-family: inherit;
    display: block;
    width: 0;
    flex-grow: 1;
    padding: 0;
    line-height: 1.2;
    z-index: 1;
  }
  label {
    color: var(--s-color-outline);
    position: absolute;
    line-height: 1.2;
    transition:
      transform 0.2s,
      font-size 0.2s;
    transform: translateY(-0.3em);
  }
  label.lifted {
    transform: translateY(-120%);
    font-size: 0.6em;
  }
}
</style>
