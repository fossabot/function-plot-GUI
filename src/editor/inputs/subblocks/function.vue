<template>
  <div class="filled-textfield" :class="{ focus: isFocus }">
    <label :class="{ lifted: !isEmpty }">{{ props.label }}</label>
    <input
      @focus="isFocus = true"
      @blur="
        isFocus = false;
        refreshInput();
      "
      type="text"
      v-model="value"
      ref="inputRef"
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

const inputRef = ref<HTMLInputElement | null>(null);
function refreshInput() {
  // On Chromium browsers, ligatures over 3 characters are not displayed until force refresh
  // Manually setting the value won't trigger Vue's reactivity system, no performance issue
  if (!inputRef.value) return;
  inputRef.value.value = value.value + "\u200B";
  inputRef.value.value = value.value;
}
</script>

<style lang="scss">
.filled-textfield {
  background-color: var(--s-color-surface-container-high);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: var(--s-color-outline-variant) solid 0.1em;
  transition:
    background-color 0.2s,
    border-bottom-color 0.2s;
  padding: 0;
  display: flex;
  &.focus {
    background-color: var(--s-color-surface-container-highest);
    border-bottom-color: var(--s-color-primary);
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
    caret-color: var(--s-color-primary);
    line-height: 1.2;
    z-index: 1;
    color: var(--s-color);
  }
  label {
    color: var(--s-color-outline);
    position: absolute;
    line-height: 1.2;
  }
  input,
  label {
    padding: 0.4em 0.45em 0.3em 0.45em;
  }
  &.styled label {
    transform: translateY(-0.05em);
  }
  label.lifted {
    opacity: 0;
  }
}
</style>
