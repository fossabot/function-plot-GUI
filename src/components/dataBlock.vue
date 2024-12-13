<template>
  <div class="plot-data" v-if="dataItem">
    <div class="selectors">
      <select v-model="dataItem.fnType" @change="fnTypeChange(dataItem)">
        <option :value="undefined">{{ fnTypeArr[0].label }}</option>
        <option v-for="type in fnTypeArr.slice(1)" :value="type.value">
          {{ type.label }}
        </option>
      </select>
      <select v-model="dataItem.graphType">
        <option
          v-if="!getFnType(dataItem.fnType).notAllowedInIntervel"
          :value="undefined"
        >
          {{ graphTypeArr[0].label }}
        </option>
        <option
          v-if="dataItem.fnType !== 'implicit'"
          v-for="type in graphTypeArr.slice(1)"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>
      <button class="delete" @click="emit('delete')">删除</button>
    </div>

    <div class="inputs">
      <div v-for="input in getFnType(dataItem.fnType).inputs" class="input-box">
        <span class="input-title">{{ input.title }}</span>
        <input
          type="text"
          v-model="dataItem[input.value]"
          :placeholder="input.placeholder"
        />
      </div>
      <template v-if="getFnType(dataItem.fnType).coord">
        <div
          v-for="input in getFnType(dataItem.fnType).coord"
          class="input-box coord"
        >
          <span class="coord-label">{{ input.label }}</span>
          <input
            type="number"
            @input="handleCoordInput(dataItem!, input.value, 0, $event)"
            :placeholder="input.placeholder1"
          />
          <span class="coord-label">{{ input.sep }}</span>
          <input
            type="number"
            @input="handleCoordInput(dataItem!, input.value, 1, $event)"
            :placeholder="input.placeholder2"
          />
          <span class="coord-label">{{ input.fin }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FunctionPlotDatum } from "function-plot";
import { fnTypeArr, graphTypeArr, inputTypeArr,getFnType } from "../consts";
import type { CoordType } from "../consts";
const emit = defineEmits(["delete"]);
const dataItem = defineModel<FunctionPlotDatum>();

function fnTypeChange(dataItem: FunctionPlotDatum) {
  if (getFnType(dataItem.fnType).notAllowedInIntervel && !dataItem.graphType)
    dataItem.graphType = "polyline";
  if (dataItem.fnType === "implicit") delete dataItem.graphType;
  inputTypeArr.forEach((key) => delete dataItem[key]);
  if (dataItem.fnType === "vector") dataItem.vector = [0, 0];
}
function handleCoordInput(
  dataItem: FunctionPlotDatum,
  key: CoordType["value"],
  index: 0 | 1,
  event: Event
) {
  const raw = (<HTMLInputElement>event.target).value;
  const newVal = Number(raw);
  if (!dataItem[key]) {
    const coord: [number, number] = [0, 0];
    coord[index] = newVal;
    dataItem[key] = coord;
  } else {
    if (raw === "") {
      if (dataItem[key][(index + 1) % 2]) dataItem[key][index] = 0;
      else delete dataItem[key];
    } else {
      dataItem[key][index] = newVal;
    }
  }
}
</script>

<style>
.plot-data {
  border-bottom: var(--c-border) 1px solid;
  background: var(--c-bk2);
  position: relative;
  padding: 20px 15px;
}
.delete {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  color: var(--c-text);
  padding: 8px 15px;
  border: none;
  background: var(--c-red);
  transition: all 0.2s;
  border-radius: 5px;
  opacity: 0.75;
}
.delete:hover {
  opacity: 1;
}
.delete:active {
  opacity: 0.2;
  transition: none;
}
.selectors {
  margin-bottom: 10px;
  position: relative;
}
.selectors select {
  border: var(--c-border) 1px solid;
  background: var(--c-bk3);
  border-radius: 5px;
  width: 30%;
  padding: 8px 8px;
  margin-right: 15px;
  color: var(--text);
  font-size: 15px;
}
.selectors select:focus {
  border-color: var(--c-accent);
}
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
  font-family: "JetBrains Mono";
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
  line-height: 100%;
  font-size: 20px;
  border-radius: 5px;
  display: block;
  width: 100%;
  text-indent: 10px;
  font-family: "JetBrains Mono";
  padding: 10px 0;
}
.inputs input:placeholder-shown {
  border-color: var(--c-red);
}
.inputs input:focus {
  border-color: var(--c-accent);
}
.add-data {
  padding-top: 10px;
  padding-bottom: 10px;
}
.add-data:hover {
  background: var(--c-bk3);
}
.add-data:active {
  background: var(--c-bk1);
}
</style>
