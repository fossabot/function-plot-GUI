<template>
  <div class="input domain">
    <s-text-field
      class="domain-input styled-inner"
      type="number"
      v-model="value1"
      :label="t('data.more.rangeMin')"
    ></s-text-field>
    <s-text-field
      class="domain-input styled-inner"
      type="number"
      v-model="value2"
      :label="t('data.more.rangeMax')"
    ></s-text-field>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

import { PrivateDataTypes } from "@/types/data";
import { ref, watch } from "vue";
const props = defineProps<{
  self:
    | PrivateDataTypes.Linear
    | PrivateDataTypes.Parametric
    | PrivateDataTypes.Polar;
  defaultMin?: number;
  defaultMax?: number;
}>();
const [defaultMin, defaultMax] =
  PrivateDataTypes.defaultRange[props.self.fnType];
const defToUndefined = (value: number) =>
  value === defaultMin || value === defaultMax ? "" : value;
const undefinedToDef = (value: number | "" | undefined, defValue: number) =>
  value === "" || value === undefined ? defValue : value;
const value1 = ref<number | "">(defToUndefined(props.self.range[0]));
const value2 = ref<number | "">(defToUndefined(props.self.range[1]));

watch(value1, (newVal) => {
  props.self.range[0] = undefinedToDef(newVal, defaultMin);
});
watch(value2, (newVal) => {
  props.self.range[1] = undefinedToDef(newVal, defaultMax);
});
</script>

<style lang="scss">
.input-inner .input.domain {
  display: flex;
  width: 100%;
  gap: 6px;
  .domain-input {
    width: 0;
    flex-grow: 1;
    &::part(input) {
      font-size: 1.25em;
    }
  }
}
</style>
