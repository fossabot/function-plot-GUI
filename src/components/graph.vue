<template>
  <div id="graph" ref="shellRef">
    <div id="graphRender" ref="plotRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { throttle } from "lodash-es";
import type { FunctionPlotDatum } from "function-plot";
import { findError } from "../consts";
const { graphData } = defineProps<{ graphData: FunctionPlotDatum[] }>();

const shellRef = ref<HTMLDivElement | null>(null);
const plotRef = ref<HTMLDivElement | null>(null);
const width = ref(0),
  height = ref(0);
const handleResize = () => {
  if (shellRef.value) {
    width.value = shellRef.value.clientWidth;
    height.value = shellRef.value.clientHeight;
  }
};
onMounted(async () => {
  const functionPlot = (await import("function-plot")).default;
  handleResize();
  window.addEventListener("resize", handleResize);
  watch(
    [width, height, graphData],
    throttle(() => {
      const flag = findError(graphData);
      if (plotRef.value)
        try {
          functionPlot({
            target: plotRef.value,
            data: flag ? graphData.slice(0, flag) : graphData,
            width: width.value - 20,
            height: height.value - 20,
          });
        } catch (e) {
          console.log(e);
        }
    }, 200),
    { immediate: true }
  );
});
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<style>
#graphRender {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  filter: invert(100%) hue-rotate(180deg) brightness(133%);
  color: black;
  user-select: none;
}
.top-right-legend {
  transform: translateY(20px);
}
</style>
