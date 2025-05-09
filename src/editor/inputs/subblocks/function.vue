<template>
  <div class="filled-textfield" :class="{ focus: isFocus }">
    <label :class="{ lifted: !isEmpty }" class="function-label">
      <component v-for="item in labelContent" :is="item"></component>
    </label>
    <input
      @focus="isFocus = true"
      @blur="isFocus = false"
      type="text"
      v-model="value"
      ref="inputRef"
    />
  </div>
</template>

<script setup lang="tsx">
/* @jsxImportSource vue */
import { computed, ref, watch } from "vue";

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
  const { selectionStart, selectionEnd } = inputRef.value;
  inputRef.value.value = value.value + "\u200B";
  inputRef.value.value = value.value;
  inputRef.value.setSelectionRange(selectionStart, selectionEnd);
}
watch(value, refreshInput);

import { tokenize } from "./functionTokenize";
const labelContent = computed(() =>
  isEmpty.value
    ? [<span>{props.label}</span>]
    : tokenize(value.value).map((token) => (
        <span
          class={[
            token.type,
            "function-label-item",
            token.level ? "level-" + token.level : undefined,
          ]}
        >
          {token.raw}
        </span>
      ))
);
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
  font-family: var(--font-math);
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
    color: transparent;
  }
  label {
    color: var(--s-color-outline);
    position: absolute;
    line-height: 1.2;
    white-space: pre;
  }
  input,
  label {
    padding: 0.4em 0.45em 0.3em 0.45em;
  }
  &.styled label {
    transform: translateY(-0.05em);
  }
  label.lifted {
    color: var(--s-color);
  }
}

.function-label {
  .function-label-item {
    display: inline-block;
  }
  .identifier {
    color: var(--s-color-primary);
  }
  .operator {
    color: var(--s-color-secondary);
    opacity: 0.8;
  }
  .bracket {
    color: var(--s-color-secondary);
  }
  @for $i from 1 through 5 {
    .bracket.level-#{$i} {
      transform: scaleY(#{0.8 + $i * 0.2});
    }
  }
  .unknown {
    color: var(--s-color-error);
  }
  .function {
    color: var(--s-color-tertiary);
  }
}
</style>
