<template>
  <div v-for="input in fnType.inputs" class="input-box">
    <span class="input-title">{{ input.title }}</span>
    <input
      type="text"
      v-model="dataItem[input.value]"
      :placeholder="input.placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { FnType } from "../../consts";
import { FunctionPlotDatum } from "function-plot";
const { dataItem, fnType } = defineProps<{
  dataItem: FunctionPlotDatum;
  fnType: FnType;
  blockFolded: boolean;
}>();
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
  font-style: italic;
  letter-spacing: 5px;
  font-size: 20px;
  font-weight: bold;
  margin: auto 5px;
  height: fit-content;
}
.inputs input {
  color: var(--c-text);
  background: var(--c-bk1);
  border: var(--c-border) 1px solid;
  height: 100%;
  font-size: 20px;
  border-radius: 5px;
  display: block;
  width: 100%;
  text-indent: 10px;
  padding: 10px 0;
}
.inputs :not(.optional) input:placeholder-shown {
  border-color: var(--c-red);
}
.inputs input:focus {
  border-color: var(--c-accent);
}
</style>
