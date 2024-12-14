<template>
  <div class="plot-data" v-if="dataItem" ref="block">
    <div class="selectors">
      <select v-model="dataItem.fnType" @change="fnTypeChange(dataItem)">
        <option :value="undefined">{{ fnTypeArr[0].label }}</option>
        <option v-for="type in fnTypeArr.slice(1)" :value="type.value">
          {{ type.label }}
        </option>
      </select>
      <select v-model="dataItem.graphType" v-if="dataItem.graphType !== 'text'">
        <option
          v-if="!getFnType(dataItem.fnType).notAllowedInInterval"
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
      <button class="delete blockBtn" @click="emit('delete')">删除</button>
      <button
        class="fold blockBtn"
        :class="{ active: !blockFolded }"
        @click="blockFolded = !blockFolded"
      >
        更多
      </button>
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
          v-for="input in getFnType(dataItem.fnType).coord?.filter(
            ({ folded }) => !(folded && blockFolded)
          )"
          class="input-box coord"
          :class="{ optional: input.optional }"
        >
          <span class="coord-label">{{ input.label }}</span>
          <input
            type="number"
            @input="handleCoordInput(dataItem!, input, 0, $event)"
            :placeholder="input.placeholder[0]"
          />
          <span class="coord-label">{{ input.sep }}</span>
          <input
            type="number"
            @input="handleCoordInput(dataItem!, input, 1, $event)"
            :placeholder="input.placeholder[1]"
          />
          <span class="coord-label">{{ input.fin }}</span>
        </div>
      </template>

      <template v-if="getFnType(dataItem.fnType).switches">
        <div
          v-for="input in getFnType(dataItem.fnType).switches?.filter(
            ({ folded }) => !(folded && blockFolded)
          )"
          class="input-box switches"
          @click="
            dataItem[input.value]
              ? delete dataItem[input.value]
              : (dataItem[input.value] = true)
          "
        >
          <span
            class="switch"
            :class="dataItem[input.value] ? 'on' : 'off'"
          ></span>
          {{ input.label }}
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FunctionPlotDatum } from "function-plot";
import { fnTypeArr, graphTypeArr, inputTypeArr, getFnType } from "../consts";
import type { CoordType } from "../consts";
import { ref } from "vue";
const emit = defineEmits(["delete"]);
const dataItem = defineModel<FunctionPlotDatum>();
const block = ref<HTMLDivElement>();
const blockFolded = ref(true);
function fnTypeChange(
  dataItem:
    | (Omit<FunctionPlotDatum, "fnType"> & {
        fnType: "text" | FunctionPlotDatum["fnType"];
      })
    | FunctionPlotDatum
) {
  inputTypeArr.forEach((key) => delete dataItem[key]);
  if (dataItem.fnType === "text") {
    dataItem.graphType = "text";
  } else {
    if (dataItem.graphType === "text" || dataItem.fnType === "implicit")
      delete dataItem.graphType;
    if (getFnType(dataItem.fnType).notAllowedInInterval && !dataItem.graphType)
      dataItem.graphType = "polyline";
    if (dataItem.fnType === "vector") dataItem.vector = [0, 0];
    if (block.value)
      block.value.querySelectorAll("input").forEach((ele) => (ele.value = ""));
  }
}
function handleCoordInput(
  dataItem: FunctionPlotDatum,
  input: CoordType,
  index: 0 | 1,
  event: Event
) {
  const raw = (<HTMLInputElement>event.target).value;
  const newVal = Number(raw);
  const key = input.value,
    defaultVal = input.defaultVal ?? [0, 0];
  if (!dataItem[key]) {
    const coord: [number, number] = [...defaultVal];
    coord[index] = newVal;
    dataItem[key] = coord;
  } else {
    if (raw !== "") dataItem[key][index] = newVal;
    else if (dataItem[key][1 - index] !== defaultVal[1 - index])
      dataItem[key][index] = defaultVal[index];
    else delete dataItem[key];
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
.blockBtn {
  height: 100%;
  float: right;
  color: var(--c-text);
  padding: 8px 15px;
  border: none;
  background: var(--c-border);
  margin-left: 10px;
  border-radius: 5px;
  opacity: 0.75;
}
.delete {
  background: var(--c-red);
}
.blockBtn.active {
  background: var(--c-accent);
}
.blockBtn:hover {
  opacity: 1;
}
.blockBtn:active {
  opacity: 0.3;
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
  min-width: 6.5em;
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

.input-box.coord {
  display: flex;
}
.input-box.coord.optional {
  color: #bbb;
}
.input-box.coord span {
  font-size: 18px;
  margin: auto 5px;
  flex-shrink: 0;
}
.input-box.coord input {
  max-width: 8em;
  min-width: 3em;
  padding: 6px 0;
  font-size: 18px;
  flex-shrink: 1;
}

.input-box.switches {
  align-items: center;
  gap: 10px;
  padding-left: 5px;
}

.switch:before,
.switch:after {
  position: absolute;
  transition: all 0.2s cubic-bezier(0, 0.48, 0.27, 0.98);
}

.switch {
  width: 40px;
  height: 20px;
  border-radius: 5px;
  position: relative;
}

.switch {
  border-radius: 10px;
}

.switch.on {
  background: var(--c-accent);
}

.switch.off {
  background: var(--c-border);
}
.switch:after {
  content: "";
  background: #fff;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
.switch.off:after {
  left: 4px;
}
.switch.on:after {
  left: 24px;
}
.switch:hover {
  filter: brightness(110%);
}

.switch:active {
  filter: brightness(90%);
}
</style>
