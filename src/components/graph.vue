<template>
  <div id="graphRender" ref="plotRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { cloneDeep, throttle } from "lodash-es";
import type { FunctionPlotDatum } from "function-plot";
import { Datum, findError } from "../consts";
const { data, width, height } = defineProps<{
  data: Datum[];
  width: number;
  height: number;
}>();
const emit = defineEmits(["requireFullUpdate", "requirePostUpdate"]);
const fullUpdateState = defineModel<boolean>();

const plotRef = ref<HTMLDivElement | null>(null);
onMounted(async () => {
  const functionPlot = (await import("function-plot")).default;
  watch(
    [() => width, () => height, () => data],
    throttle(() => {
      const graphData = cloneDeep(data);
      const flag = findError(graphData);
      if (flag) return;
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
        }
      } catch (e) {
        console.log(e);
        if (!fullUpdateState.value) emit("requireFullUpdate");
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
</style>
