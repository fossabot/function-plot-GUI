<template>
  <div id="graphRender" ref="plotRef"></div>
  <div class="buttons" id="topright">
    <s-tooltip align="right">
      <s-icon-button slot="trigger" @click="emit('requireFullUpdate')">
        <s-icon>
          <svg viewBox="0 -960 960 960">
            <path
              d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
            ></path>
          </svg>
        </s-icon>
      </s-icon-button>
      {{ t("buttons.reset") }}
    </s-tooltip>
    <s-tooltip align="right" v-if="errorMsg !== undefined">
      <s-icon-button slot="trigger">
        <s-icon id="warningIcon">
          <svg viewBox="0 -960 960 960">
            <path
              d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"
            ></path>
          </svg>
        </s-icon>
      </s-icon-button>
      <pre class="tooltipMsgPre">{{ errorMsg }}</pre>
    </s-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { onMounted, ref, watch } from "vue";
import { cloneDeep, throttle } from "lodash-es";
import type { FunctionPlotDatum } from "function-plot";
import { getFnType } from "../consts";
const { data, width, height } = defineProps<{
  data: FunctionPlotDatum[];
  width: number;
  height: number;
}>();
const emit = defineEmits(["requireFullUpdate", "requirePostUpdate"]);
const fullUpdateState = defineModel<boolean>();

const plotRef = ref<HTMLDivElement | null>(null);
const errorMsg = ref<string | undefined>(undefined);

function findError(graphData: FunctionPlotDatum[]) {
  for (const [index, dataItem] of graphData.entries()) {
    const fnType = getFnType(dataItem.fnType);
    for (const input of fnType.inputs) if (!dataItem[input.value]) return index;
    for (const coord of fnType.coord ?? [])
      if (!dataItem[coord.value] && !coord.optional) return index;
  }
  return 0;
}

onMounted(async () => {
  const functionPlot = (await import("function-plot")).default;
  watch(
    [() => width, () => height, () => data],
    throttle(() => {
      const graphData = cloneDeep(data);
      const flag = findError(graphData);
      if (flag) {
        errorMsg.value = `Invalid input in function ${flag + 1}`;
        return;
      }
      try {
        plotRef.value &&
          functionPlot({
            target: plotRef.value,
            data: <FunctionPlotDatum[]>(
              // (flag ? graphData.slice(0, flag) : graphData)
              graphData
            ),
            width: width - 20,
            height: height - 20,
          });
        if (fullUpdateState.value) {
          fullUpdateState.value = false;
          emit("requirePostUpdate");
        } else errorMsg.value = undefined;
      } catch (e) {
        // console.log(e);
        if (!fullUpdateState.value) emit("requireFullUpdate");
        errorMsg.value = (e as Error).message;
      }
    }, 200),
    { immediate: true }
  );
});
</script>

<style>
#graphRender {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: fit-content;
  height: fit-content;
  margin: auto;
  filter: invert(100%) hue-rotate(180deg) brightness(133%);
  color: black;
  user-select: none;
}

.onresize #graphRender {
  left: 50%;
  right: unset;
  width: fit-content;
  transform: translateX(-50%);
}
.top-right-legend {
  display: none;
}

#topright {
  position: absolute;
  top: 25px;
  right: 25px;
  display: flex;
  flex-direction: column;
}

#warningIcon {
  color: var(--s-color-warning);
}

.tooltipMsgPre {
  margin: 0;
  padding: 0;
  font-size: 14px;
}
</style>
