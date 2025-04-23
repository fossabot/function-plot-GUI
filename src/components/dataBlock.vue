<template>
  <div class="plot-data" v-if="dataItem" ref="block">
    <div class="selectors">
      <s-picker
        :label="t('inputs.fnType')"
        v-model.lazy="dataItem.fnType"
        @change="fnTypeChange(dataItem)"
      >
        <s-picker-item
          v-for="(type, index) in fnTypeArr"
          :value="type.value"
          :selected="index === 0"
        >
          {{ t(type.label) }}
        </s-picker-item>
      </s-picker>
      <s-picker
        :label="t('inputs.graphType')"
        v-model.lazy="dataItem.graphType"
        v-if="dataItem.graphType !== 'text'"
        @change="graphTypeChange(dataItem)"
      >
        <s-picker-item
          v-for="(type, index) in allowedGraphType"
          :value="type.value"
          :selected="index === 0"
        >
          {{ t(type.label) }}
        </s-picker-item>
      </s-picker>
      <div style="flex-grow: 1"></div>
      <div class="dataBlockBtns">
        <s-tooltip>
          <s-icon-button slot="trigger" @click="emit('delete')">
            <s-icon style="color: var(--s-color-error)">
              <svg viewBox="0 -960 960 960">
                <path
                  d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                ></path>
              </svg>
            </s-icon>
          </s-icon-button>
          {{ t("buttons.del") }}
        </s-tooltip>
        <s-tooltip>
          <s-icon-button
            slot="trigger"
            @click="dataItem.hidden = !dataItem.hidden"
            :type="dataItem.hidden ? 'filled-tonal' : 'standard'"
          >
            <s-icon>
              <svg viewBox="0 -960 960 960">
                <path
                  d="M280-440h400v-80H280v80ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                ></path>
              </svg>
            </s-icon>
          </s-icon-button>
          {{ t("buttons.hide") }}
        </s-tooltip>
        <s-tooltip>
          <s-icon-button
            slot="trigger"
            @click="
              blockFolded = !blockFolded;
              console.log(foldShell);
            "
          >
            <s-icon :name="blockFolded ? 'chevron_down' : 'chevron_up'">
            </s-icon>
          </s-icon-button>
          {{ t(blockFolded ? "buttons.expand" : "buttons.collapse") }}
        </s-tooltip>
        <span class="datablock-drag">
          <s-icon>
            <svg viewBox="0 -960 960 960">
              <path
                d="M320-440v-287L217-624l-57-56 200-200 200 200-57 56-103-103v287h-80ZM600-80 400-280l57-56 103 103v-287h80v287l103-103 57 56L600-80Z"
              ></path>
            </svg>
          </s-icon>
        </span>
      </div>
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
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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

const foldShell = ref<HTMLElementTagNameMap["s-fold"]>();

function fnTypeChange(dataItem: InternalDatum) {
  console.log(dataItem);
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
  border-bottom: var(--s-color-outline-variant) 1px solid;
  position: relative;
  padding: 20px 15px;
  overflow-x: hidden;
}
.selectors {
  margin-bottom: 10px;
  position: relative;
  display: flex;
  gap: 10px;
  align-items: center;
}
.selectors s-picker {
  width: 8em;
}
.dataBlockBtns {
  display: flex;
}
.datablock-drag {
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
  cursor: grab;
  display: inline-flex;
  justify-content: center;
}

.sortable-chosen .datablock-drag {
  background: var(--s-color-outline-variant);
}
.sortable-chosen {
  z-index: 999;
}
</style>
