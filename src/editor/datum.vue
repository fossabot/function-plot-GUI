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
          <s-icon-button
            slot="trigger"
            @click="emit('delete')"
            style="color: var(--s-color-error)"
          >
            <SIconDelete />
          </s-icon-button>
          {{ t("buttons.del") }}
        </s-tooltip>
        <s-tooltip>
          <s-icon-button
            slot="trigger"
            @click="dataItem.hidden = !dataItem.hidden"
            :type="dataItem.hidden ? 'filled-tonal' : 'standard'"
          >
            <SIconHide />
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
          <SIconDrag />
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
import StrInputs from "./inputs/strInputs.vue";
import CoordInputs from "./inputs/coordInputs.vue";
import SwitchInputs from "./inputs/switchInputs.vue";
import CoordArrInputs from "./inputs/coordArrInputs.vue";
import OptInputs from "./inputs/optInputs.vue";

import SIconDelete from "@/ui/icons/delete.vue";
import SIconHide from "@/ui/icons/hide.vue";
import SIconDrag from "@/ui/icons/drag.vue";

const emit = defineEmits(["delete"]);
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

import emitter from "@/mitt";
function graphTypeChange(dataItem: InternalDatum) {
  if (dataItem.graphType === "scatter") {
    if (!scatteredSet.has(dataItem)) {
      scatteredSet.add(dataItem);
      emitter.emit("require-full-update");
    }
  } else {
    if (scatteredSet.has(dataItem)) {
      scatteredSet.delete(dataItem);
      emitter.emit("require-full-update");
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
