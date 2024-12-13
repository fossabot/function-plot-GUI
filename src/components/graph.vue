<template>
  <div id="graph" ref="shellRef">
    {{ width }},{{ height }}
    <div id="graphRender" ref="plotRef"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import functionPlot from "function-plot";
import { throttle } from "lodash-es";
import type { FunctionPlotDatum } from "function-plot";
import { getFnType } from "../consts";
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
onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
  watch(
    [width, height, () => graphData],
    throttle(() => {
      const data = <FunctionPlotDatum[]>JSON.parse(JSON.stringify(graphData));
      for (const dataItem of data) {
        const fnType = getFnType(dataItem.fnType);
        if (fnType.notAllowedInIntervel && !dataItem.graphType) return;
        for (const input of fnType.inputs)
          if (!dataItem[input.value]) return;
        for (const coord of fnType.coord ?? [])
          if (!dataItem[coord.value] && !coord.optional) return;
      }
      if (plotRef.value && width.value && height.value)
        functionPlot({
          data,
          target: plotRef.value,
          width: width.value,
          height: height.value,
        });
    }, 200),
    { immediate: true, deep: true }
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
  filter: invert() hue-rotate(180deg);
  color: black;
}
</style>
