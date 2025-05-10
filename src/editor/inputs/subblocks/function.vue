<template>
  <div class="filled-textfield" :class="{ focus: isFocus }">
    <div class="filled-textfield-inner">
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
  </div>
</template>

<script setup lang="tsx">
/* @jsxImportSource vue */
import { computed, ref, watch } from "vue";

const value = defineModel<string>({ required: true });
const props = defineProps<{
  label: string;
  identifiers?: string[];
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
    : tokenize(value.value, props.identifiers || ["x"]).map((token) => (
        <span
          class={[
            token.type,
            token.raw,
            "function-label-item",
            token.level ? "level-" + Math.min(token.level, 5) : undefined,
            token.err ? "error" : undefined,
            token.sqrtLevel ? "under-sqrt" : undefined,
          ]}
        >
          <span class="inner">{token.raw}</span>
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
  font-family: var(--font-math);
  overflow-x: scroll;
  cursor: text;
  &.focus {
    background-color: var(--s-color-surface-container-highest);
    border-bottom-color: var(--s-color-primary);
  }
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
  .filled-textfield-inner {
    width: fit-content;
    position: relative;
    min-width: 100%;
    overflow-y: hidden;
  }
  .filled-textfield-inner::-webkit-scrollbar {
    display: none;
    height: 0;
    width: 0;
  }
  label {
    color: var(--s-color-outline);
    white-space: pre;
    width: fit-content;
  }
  input {
    background-color: transparent;
    border: none;
    outline: none;
    font-size: inherit;
    font-family: inherit;
    caret-color: var(--s-color-primary);
    color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }

  input,
  label {
    display: block;
    padding: 0.2em 0.45em 0.1em 0.45em;
    line-height: 1.6;
  }
  &.styled label {
    transform: translateY(-0.05em);
  }
  label.lifted {
    color: var(--s-color);
  }
}

.function-label {
  .function-label-item,
  .function-label-item .inner {
    display: inline-block;
  }
  .identifier {
    color: var(--s-color-primary);
  }
  .operator {
    color: var(--s-color-secondary);
  }
  .bracket {
    color: var(--s-color-secondary);
  }
  @for $i from 1 through 5 {
    .bracket.level-#{$i} .inner {
      transform: scaleY(#{0.8 + $i * 0.2});
    }
  }
  .unknown {
    color: var(--s-color-error);
  }
  .function {
    color: var(--s-color-tertiary);
  }
  .error .inner {
    text-decoration: underline var(--s-color-error);
    text-decoration-thickness: 0.05em;
    text-underline-offset: 0.1em;
  }
  .sqrt {
    transform: scaleY(1.3) translateY(-1px);
  }
  .under-sqrt {
    background-image: linear-gradient(
      to bottom,
      transparent 0.1em,
      var(--s-color-tertiary) 0.1em,
      var(--s-color-tertiary) 0.14em,
      transparent 0.14em,
      transparent 100%
    );
    &.sqrt {
      transform: none !important;
    }
  }
}
</style>
