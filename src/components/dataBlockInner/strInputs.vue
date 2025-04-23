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

// Chromium 文本框输入三个字形以上的连字时渲染不生效
// 需要在失去焦点时手动添加空格再删除以触发渲染

function handleBlur(index: number) {
  inputBox.value![index].value = inputBox.value![index].value + " ";
  inputBox.value![index].value = inputBox.value![index].value.trim();
}
const emit = defineEmits(["blur"]);
</script>

<style>
.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.inputs .input-box {
  position: relative;
  display: flex;
}
.inputs .input-box .input-title {
  font-size: 25px;
  margin: auto 5px;
  height: fit-content;
}
.inputs s-text-field {
  font-size: 22px;
  flex-grow: 1;
}
</style>
