<template>
  <div id="graph" ref="shellRef">
    {{ width }},{{ height }},{{ cnt }}
    <div id="graphRender" ref="plotRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import functionPlot from "function-plot";
import type { FunctionPlotDatum } from "function-plot";
const { graphData } = defineProps<{ graphData: FunctionPlotDatum[] }>();
const shellRef = ref<HTMLDivElement | null>(null);
const plotRef = ref<HTMLDivElement | null>(null);
const width = ref(0),
  height = ref(0);
const cnt = ref(0);
const handleResize = () => {
  if (shellRef.value) {
    width.value = shellRef.value.clientWidth;
    height.value = shellRef.value.clientHeight;
  }
};
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
  watch(
    [width, height, () => graphData],
    () => {
			cnt.value++
      if (plotRef.value && width.value && height.value) {
        functionPlot({
          data: JSON.parse(JSON.stringify(graphData)),
          target: plotRef.value,
          width: width.value,
          height: height.value,
        });
        cnt.value++;
      }
    },
    { immediate: true, deep: true }
  );
});
onUnmounted(() => window.removeEventListener("resize", handleResize));
watch(
  () => graphData,
  () => cnt.value++
);
</script>

<style>
#graphRender {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
