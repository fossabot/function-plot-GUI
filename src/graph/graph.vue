<template>
  <div id="graphRender" ref="plotRef"></div>
  <div class="buttons" id="topright">
    <s-tooltip align="right">
      <s-icon-button
        slot="trigger"
        @click="emitter.emit('require-full-update')"
      >
        <SIconRefresh />
      </s-icon-button>
      {{ t("buttons.reset") }}
    </s-tooltip>
    <s-tooltip align="right" v-if="errorMsg !== undefined">
      <s-icon-button slot="trigger" style="color: var(--s-color-warning)">
        <SIconWarn />
      </s-icon-button>
      <pre class="tooltipMsgPre">{{ errorMsg }}</pre>
    </s-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import SIconRefresh from "@/ui/icons/refresh.vue";
import SIconWarn from "@/ui/icons/warn.vue";

import { onMounted, ref, watch } from "vue";
import { cloneDeep, throttle } from "lodash-es";
import type { FunctionPlotDatum } from "function-plot";
import { getFnType } from "../consts";
const { data, width, height } = defineProps<{
  data: FunctionPlotDatum[];
  width: number;
  height: number;
}>();

import emitter from "@/mitt";
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
          emitter.emit("require-post-update");
        } else errorMsg.value = undefined;
      } catch (e) {
        // console.log(e);
        if (!fullUpdateState.value) emitter.emit("require-full-update");
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
  color: black;
  user-select: none;
  transition: filter 1ms;
}

@media (prefers-color-scheme: dark) {
  s-page.auto #graphRender {
    filter: invert(100%) hue-rotate(180deg) brightness(133%);
  }
}
s-page.dark #graphRender {
  filter: invert(100%) hue-rotate(180deg) brightness(133%);
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

.tooltipMsgPre {
  margin: 0;
  padding: 0;
  font-size: 14px;
}
</style>
