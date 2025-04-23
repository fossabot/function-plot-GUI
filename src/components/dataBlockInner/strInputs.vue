<template>
  <div v-for="input in fnType.inputs" class="input-box">
    <span class="input-title styled">{{ t(input.title) }}</span>
    <s-text-field
      v-model="dataItem[input.value]"
      :label="t(input.placeholder)"
      class="styled"
    >
    </s-text-field>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { InputProps } from "../../consts";
const { dataItem, fnType } = defineProps<InputProps>();
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
