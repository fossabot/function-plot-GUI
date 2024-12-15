<template>
  <div class="plot-data" v-if="dataItem" ref="block">
    <div class="datablock-drag">☰</div>
    <div class="selectors">
      <select v-model="dataItem.fnType" @change="fnTypeChange(dataItem)">
        <option :value="undefined">{{ fnTypeArr[0].label }}</option>
        <option v-for="type in fnTypeArr.slice(1)" :value="type.value">
          {{ type.label }}
        </option>
      </select>
      <select v-model="dataItem.graphType" v-if="dataItem.graphType !== 'text'">
        <option v-if="!fnType.notAllowedInInterval" :value="undefined">
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
      <div style="flex-grow: 2"></div>
      <button
        class="fold blockBtn"
        :class="{ active: !blockFolded }"
        @click="blockFolded = !blockFolded"
      >
        更多
      </button>
      <button class="delete blockBtn" @click="emit('delete')">删除</button>
    </div>

    <div class="inputs">
      <StrInputs
        :dataItem="dataItem"
        :fnType="fnType"
        :blockFolded="blockFolded"
      />
      <CoordInputs
        v-if="fnType.coord"
        :dataItem="dataItem"
        :fnType="fnType"
        :blockFolded="blockFolded"
      />
      <CoordArrInputs
        v-if="fnType.coordArr"
        :dataItem="dataItem"
        :fnType="fnType"
        :blockFolded="blockFolded"
      />
      <SwitchInputs
        v-if="fnType.switches"
        :dataItem="dataItem"
        :fnType="fnType"
        :blockFolded="blockFolded"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FunctionPlotDatum } from "function-plot";
import { fnTypeArr, graphTypeArr, inputTypeArr, getFnType } from "../consts";
import { ref, computed } from "vue";
import StrInputs from "./dataBlockInner/strInputs.vue";
import CoordInputs from "./dataBlockInner/coordInputs.vue";
import SwitchInputs from "./dataBlockInner/switchInputs.vue";
import CoordArrInputs from "./dataBlockInner/coordArrInputs.vue";

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
    if (fnType.value.notAllowedInInterval && !dataItem.graphType)
      dataItem.graphType = "polyline";
    if (dataItem.fnType === "vector") dataItem.vector = [0, 0];
    if (dataItem.fnType === "points") dataItem.points = [];
    if (block.value)
      block.value.querySelectorAll("input").forEach((ele) => (ele.value = ""));
  }
}
const fnType = computed(() => getFnType(dataItem.value?.fnType));
</script>

<style>
.plot-data {
  border-bottom: var(--c-border) 1px solid;
  background: var(--c-bk2);
  position: relative;
  padding: 20px 15px 20px 35px;
  overflow-x: hidden;
}
.blockBtn {
  color: var(--c-text);
  padding: 0 15px;
  border: none;
  background: var(--c-bk3);
  border-radius: 5px;
  opacity: 0.75;
  border: var(--c-border) 1px solid;
  flex-shrink: 0;
}
.delete {
  background: var(--c-red);
  border-color: var(--c-red2);
}
.blockBtn.active {
  background: var(--c-bk1);
}
.blockBtn:hover {
  opacity: 1;
}
.blockBtn:active {
  opacity: 1;
  filter: brightness(0.5);
}

.selectors {
  margin-bottom: 10px;
  position: relative;
  display: flex;
  gap: 10px;
}
.selectors select {
  border: var(--c-border) 1px solid;
  background: var(--c-bk3);
  border-radius: 5px;
  flex-grow: 1;
  padding: 8px 8px;
  color: var(--text);
  font-size: 15px;
  width: 6.5em;
}
.selectors select:focus {
  border-color: var(--c-accent);
}
.datablock-drag {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  width: 20px;
  background: var(--c-bk3);
  border-right: 1px solid var(--c-border);
  height: 100%;
  cursor: grab;
  color: var(--c-text);
  text-align: center;
  font-size: 18px;
}
.sortable-chosen .datablock-drag {
  background: var(--c-border);
}
.sortable-chosen {
  z-index: 999;
}
</style>
