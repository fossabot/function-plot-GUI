<template>
  <div class="input domain">
    <s-text-field
      class="domain-input styled-inner"
      type="number"
      v-model="value1"
      label="最小值"
    ></s-text-field>
    <s-text-field
      class="domain-input styled-inner"
      type="number"
      v-model="value2"
      label="最大值"
    ></s-text-field>
  </div>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { ref, watch } from "vue";
const props = defineProps<{ self: PrivateDataTypes.Functions }>();
const infToUndefined = (value: number) =>
  value === Infinity || value === -Infinity ? "" : value;
const undefinedToInf = (value: number | "" | undefined, sign: number) =>
  value === "" || value === undefined ? sign * Infinity : value;
const value1 = ref<number | "">(infToUndefined(props.self.range[0]));
const value2 = ref<number | "">(infToUndefined(props.self.range[1]));

watch(value1, (newVal) => {
  props.self.range[0] = undefinedToInf(newVal, -1);
});
watch(value2, (newVal) => {
  props.self.range[1] = undefinedToInf(newVal, 1);
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
