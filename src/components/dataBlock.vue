<template>
  <div class="plot-data" v-if="dataItem" ref="block">
    <div class="datablock-drag"></div>
    <div class="selectors">
      <select v-model="dataItem.fnType" @change="fnTypeChange(dataItem)">
        <option v-for="type in fnTypeArr" :value="type.value">
          {{ t(type.label) }}
        </option>
      </select>
      <select
        v-model="dataItem.graphType"
        v-if="dataItem.graphType !== 'text'"
        @change="graphTypeChange(dataItem)"
      >
        <option v-for="type in allowedGraphType" :value="type.value">
          {{ t(type.label) }}
        </option>
      </select>
      <div style="flex-grow: 2"></div>
      <button
        class="fold blockBtn"
        :class="{ active: !blockFolded }"
        @click="blockFolded = !blockFolded"
      >
        {{ t(blockFolded ? "buttons.expand" : "buttons.collapse") }}
      </button>
      <button class="delete blockBtn" @click="emit('delete')">
        {{ t("buttons.del") }}
      </button>
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
      <OptInputs
        v-if="fnType.optInput"
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
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import {
  fnTypeArr,
  getAllowedGraphType,
  inputTypeArr,
  getFnType,
  InternalDatum,
} from "../consts";
import { ref, computed } from "vue";
import StrInputs from "./dataBlockInner/strInputs.vue";
import CoordInputs from "./dataBlockInner/coordInputs.vue";
import SwitchInputs from "./dataBlockInner/switchInputs.vue";
import CoordArrInputs from "./dataBlockInner/coordArrInputs.vue";
import OptInputs from "./dataBlockInner/optInputs.vue";

const emit = defineEmits(["delete", "requireFullUpdate"]);
const dataItem = defineModel<InternalDatum>();
const block = ref<HTMLDivElement>();
const blockFolded = ref(true);
function fnTypeChange(dataItem: InternalDatum) {
  inputTypeArr.forEach((key) => delete dataItem[key]);
  if (dataItem.fnType === "text") {
    dataItem.graphType = "text";
  } else {
    if (dataItem.graphType === "text" || dataItem.fnType === "implicit")
      delete dataItem.graphType;
    dataItem.graphType = getAllowedGraphType(dataItem.fnType)[0].value;
    if (dataItem.fnType === "vector") dataItem.vector = [0, 0];
    if (dataItem.fnType === "points") dataItem.points = [];
    if (block.value)
      block.value.querySelectorAll("input").forEach((ele) => (ele.value = ""));
  }
}
const scatteredSet = new WeakSet<InternalDatum>();
function graphTypeChange(dataItem: InternalDatum) {
  if (dataItem.graphType === "scatter") {
    if (!scatteredSet.has(dataItem)) {
      scatteredSet.add(dataItem);
      emit("requireFullUpdate");
    }
  } else {
    if (scatteredSet.has(dataItem)) {
      scatteredSet.delete(dataItem);
      emit("requireFullUpdate");
    }
  }
}
const fnType = computed(() => getFnType(dataItem.value?.fnType));
const allowedGraphType = computed(() =>
  getAllowedGraphType(dataItem.value?.fnType)
);
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
