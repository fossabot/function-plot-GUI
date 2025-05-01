<!--
ToDo: Refactor data editor to sigle component per fnType, instead of generating elements from consts
      The UI is so deeply coupled with the data structure that it makes nosense to make a component for 'general' data
-->
<template>
  <div class="plot-data" :class="{ hidden: props.self.hidden }">
    <div class="selectors">
      <!-- fnType Picker -->
      <s-picker
        :label="t('inputs.fnType')"
        v-model.lazy="fnType"
        :key="selectKey"
      >
        <s-picker-item v-for="type in fnTypeArr" :value="type.value">
          {{ t(type.label) }}
        </s-picker-item>
      </s-picker>

      <!-- graphType Picker -->
      <s-picker
        :label="t('inputs.graphType')"
        v-model.lazy="props.self.graphType"
        v-show="props.self.graphType !== 'text'"
        :key="selectKey"
      >
        <s-picker-item v-for="type in allowedGraphType" :value="type.value">
          {{ t(type.label) }}
        </s-picker-item>
      </s-picker>

      <div style="flex-grow: 1"></div>

      <!-- Buttons -->
      <div class="dataBlockBtns">
        <!-- Delete -->
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
        <!-- Hide -->
        <s-tooltip>
          <s-icon-button
            slot="trigger"
            @click="props.self.hidden = !props.self.hidden"
            :type="props.self.hidden ? 'filled-tonal' : 'standard'"
          >
            <SIconHide />
          </s-icon-button>
          {{ t("buttons.hide") }}
        </s-tooltip>
        <!-- Fold -->
        <s-tooltip>
          <s-icon-button slot="trigger" @click="folded = !folded">
            <s-icon :name="folded ? 'chevron_down' : 'chevron_up'"> </s-icon>
          </s-icon-button>
          {{ t(folded ? "buttons.expand" : "buttons.collapse") }}
        </s-tooltip>
        <!-- Drag -->
        <span class="datablock-drag drag-icon">
          <SIconDrag />
        </span>
      </div>
    </div>

    <!-- <div class="inputs">
      <StrInputs :dataItem="dataItem" :fnType="fnType" />
      <CoordInputs
        v-if="fnType.coord"
        :dataItem="dataItem"
        :fnType="fnType"
        :folded="false"
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
        :folded="false"
      />
    </div>
    <s-fold :folded="folded">
      <div class="inputs optional">
        <s-divider>{{ t("title.moreOptions") }}</s-divider>
        <CoordInputs
          v-if="fnType.coord"
          :dataItem="dataItem"
          :fnType="fnType"
          :folded="true"
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
          :folded="true"
        />
      </div>
    </s-fold> -->
    <div class="relative">
      <Transition name="input-component">
        <component
          :is="components[fnType]"
          :self="props.self"
          :folded="folded"
        />
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

import { fnTypeArr, getAllowedGraphType } from "../consts";
import { ref, computed } from "vue";

// import StrInputs from "./legacyInputs/strInputs.vue";
// import CoordInputs from "./legacyInputs/coordInputs.vue";
// import SwitchInputs from "./legacyInputs/switchInputs.vue";
// import CoordArrInputs from "./legacyInputs/coordArrInputs.vue";
// import OptInputs from "./legacyInputs/optInputs.vue";

import linear from "./inputs/linear.vue";
import implicit from "./inputs/implicit.vue";
import parametric from "./inputs/parametric.vue";
import polar from "./inputs/polar.vue";
import points from "./inputs/points.vue";
import vector from "./inputs/vector.vue";
import text from "./inputs/text.vue";

const components = {
  linear,
  implicit,
  parametric,
  polar,
  points,
  vector,
  text,
};

import SIconDelete from "@/ui/icons/delete.vue";
import SIconHide from "@/ui/icons/hide.vue";
import SIconDrag from "@/ui/icons/drag.vue";

const props = defineProps<{ index: number; self: PrivateData }>();
const folded = ref(true);

import { Snackbar } from "sober";
import { useProfile } from "@/states";
const profile = useProfile();

function deleteDatum() {
  const backup = props.self;
  profile.datum.splice(props.index, 1);
  Snackbar.builder({
    text: t("title.deleteSuccess"),
    action: {
      text: t("buttons.undo"),
      click: () => {
        profile.datum.splice(props.index, 0, backup);
      },
    },
  });
}

// function fnTypeChange(dataItem: InternalDatum) {
//   console.log(dataItem);
//   inputTypeArr.forEach((key) => delete dataItem[key]);
//   if (dataItem.fnType === "text") {
//     dataItem.graphType = "text";
//   } else {
//     if (dataItem.fnType === "implicit") dataItem.graphType = "interval";
//     dataItem.graphType = getAllowedGraphType(dataItem.fnType)[0].value;
//     if (dataItem.fnType === "vector") dataItem.vector = [0, 0];
//     if (dataItem.fnType === "points") dataItem.points = [];
//   }
// }

const allowedGraphType = computed(() => getAllowedGraphType(props.self.fnType));

import { watch } from "vue";
import { PrivateData } from "@/types/data";
const selectKey = ref(0);
watch(locale, () => selectKey.value++);

const fnType = ref(props.self.fnType);
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
  overflow: hidden;
  transition:
    opacity 0.15s,
    filter 0.15s;
}
.plot-data.hidden {
  opacity: 0.6;
  filter: contrast(0.6) saturate(0.8);
}
.datumFolder {
  border-bottom: var(--s-color-outline-variant) 1px solid;
}
.selectors {
  margin-bottom: 10px;
  position: relative;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
}
.selectors s-picker {
  width: 8em;
}
.dataBlockBtns {
  display: flex;
}
.drag-icon {
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
  cursor: grab;
  display: inline-flex;
  justify-content: center;
}

.sortable-chosen .drag-icon {
  background: var(--s-color-outline-variant);
}
.sortable-chosen {
  z-index: 999;
}
</style>

<style lang="scss">
.input-component {
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
  &-enter-active {
    transition: opacity 0.3s 0.05s;
  }
  &-leave-active {
    transition: opacity 0.15s;
  }
  &-leave-active {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }
}
</style>
