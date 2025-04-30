<template>
  <div v-for="(input, index) in fnType.inputs" class="input-box">
    <span class="input-title styled">{{ t(input.title) }}</span>
    <s-text-field
      v-model.trim="dataItem[input.value]"
      :label="t(input.placeholder)"
      class="styled"
      ref="inputBox"
      @blur="handleBlur(index)"
    >
    </s-text-field>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { InputProps } from "../../consts";
import { ref } from "vue";
const { dataItem, fnType } = defineProps<InputProps>();

const inputBox = ref<HTMLElementTagNameMap["s-text-field"][]>();

// In Chromium, ligatures of three or more glyphs in text input fields may not render correctly
// You need to manually assign the value to the input when it loses focus to trigger rendering
// Directly setting the .value property does not trigger Vue's reactivity system, so there's no performance concern

function handleBlur(index: number) {
  const element = inputBox.value![index];
  const value = element.value;
  element.value = value + "\u200B";
  element.value = value;
}
const emit = defineEmits(["blur"]);
</script>

<style>
.inputs .input-box .input-title {
  font-size: 25px;
  margin: auto 5px;
  height: fit-content;
}
.inputs s-text-field {
  font-size: 22px;
  flex-grow: 1;
  width: 0;
}
</style>
