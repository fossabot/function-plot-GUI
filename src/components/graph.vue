<template>
  <div id="graphRender" ref="plotRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { throttle } from "lodash-es";
import type { FunctionPlotDatum } from "function-plot";
import { findError } from "../consts";
const { graphData, width, height } = defineProps<{
  graphData: FunctionPlotDatum[];
  width: number;
  height: number;
}>();

const plotRef = ref<HTMLDivElement | null>(null);
onMounted(async () => {
  const functionPlot = (await import("function-plot")).default;
  watch(
    [() => width, () => height],
    throttle(() => {
      const flag = findError(graphData);
      try {
        plotRef.value &&
          functionPlot({
            target: plotRef.value,
            data: flag ? graphData.slice(0, flag) : graphData,
            width: width - 20,
            height: height - 20,
          });
      } catch (e) {
        console.log(e);
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
