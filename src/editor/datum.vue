<template>
  <s-fold :folded="hidden" v-if="dataItem" class="plot-data-fold">
    <div class="plot-data" ref="block" :class="{ hidden: dataItem.hidden }">
      <div class="selectors">
        <s-picker
          :label="t('inputs.fnType')"
          v-model.lazy="dataItem.fnType"
          @change="fnTypeChange(dataItem)"
          :key="selectKey"
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
          :key="selectKey"
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
              @click="deleteDatum"
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
        <StrInputs :dataItem="dataItem" :fnType="fnType" />
        <CoordInputs
          v-if="fnType.coord"
          :dataItem="dataItem"
          :fnType="fnType"
          :blockFolded="false"
        />
        <CoordArrInputs
          v-if="fnType.coordArr"
          :dataItem="dataItem"
          :fnType="fnType"
        />
        <SwitchInputs
          v-if="fnType.switches"
          :dataItem="dataItem"
          :fnType="fnType"
          :blockFolded="false"
        />
      </div>
      <s-fold :folded="blockFolded">
        <div class="inputs optional">
          <s-divider>{{ t("title.moreOptions") }}</s-divider>
          <CoordInputs
            v-if="fnType.coord"
            :dataItem="dataItem"
            :fnType="fnType"
            :blockFolded="true"
          />
          <OptInputs
            v-if="fnType.optInput"
            :dataItem="dataItem"
            :fnType="fnType"
          />
          <SwitchInputs
            v-if="fnType.switches"
            :dataItem="dataItem"
            :fnType="fnType"
            :blockFolded="true"
          />
        </div>
      </s-fold>
    </div>
  </s-fold>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

import {
  fnTypeArr,
  getAllowedGraphType,
  inputTypeArr,
  getFnType,
  InternalDatum,
} from "../consts";
import { ref, computed, onMounted } from "vue";
import StrInputs from "./inputs/strInputs.vue";
import CoordInputs from "./inputs/coordInputs.vue";
import SwitchInputs from "./inputs/switchInputs.vue";
import CoordArrInputs from "./inputs/coordArrInputs.vue";
import OptInputs from "./inputs/optInputs.vue";

import SIconDelete from "@/ui/icons/delete.vue";
import SIconHide from "@/ui/icons/hide.vue";
import SIconDrag from "@/ui/icons/drag.vue";

const dataItem = defineModel<InternalDatum>();
const props = defineProps<{ index: number }>();
const block = ref<HTMLDivElement>();
const blockFolded = ref(true);

const foldShell = ref<HTMLElementTagNameMap["s-fold"]>();

const hidden = ref(true);

onMounted(() => setTimeout(() => (hidden.value = false), 0));
import { Snackbar } from "sober";
import { useProfile } from "../consts";
const profile = useProfile();
function deleteDatum() {
  hidden.value = true;
  const backup = cloneDeep(dataItem.value)!;
  setTimeout(() => {
    profile.data.splice(props.index, 1);
  }, 200);
  Snackbar.builder({
    text: t("title.deleteSuccess"),
    action: {
      text: t("buttons.undo"),
      click: () => {
        profile.data.splice(props.index, 0, backup);
      },
    },
  });
}

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
import { cloneDeep } from "lodash-es";
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

import { watch } from "vue";
const selectKey = ref(0);
watch(locale, () => selectKey.value++);
</script>

<style>
.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.inputs.optional {
  margin-top: 10px;
  margin-bottom: 5px;
}

.inputs .input-box {
  position: relative;
  display: flex;
}
.plot-data {
  position: relative;
  padding: 20px 15px;
  overflow-x: hidden;
  transition:
    opacity 0.15s,
    filter 0.15s;
}
.plot-data.hidden {
  opacity: 0.6;
  filter: contrast(0.6) saturate(0.8);
}
.plot-data-fold {
  border-bottom: var(--s-color-outline-variant) 1px solid;
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
