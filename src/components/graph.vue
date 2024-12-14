<template>
  <div id="graph" ref="shellRef">
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
    [width, height],
    throttle(() => {
      const data = <FunctionPlotDatum[]>JSON.parse(JSON.stringify(graphData));
      let flag = 0;
      outer: for (const [index, dataItem] of data.entries()) {
        const fnType = getFnType(dataItem.fnType);
        if (fnType.notAllowedInIntervel && !dataItem.graphType) {
          flag = index;
          break;
        }
        for (const input of fnType.inputs)
          if (!dataItem[input.value]) {
            flag = index;
            break outer;
          }
        for (const coord of fnType.coord ?? [])
          if (!dataItem[coord.value] && !coord.optional) {
            flag = index;
            break outer;
          }
      }
      if (plotRef.value)
        try {
          functionPlot({
            target: plotRef.value,
            data: flag ? data.slice(0, flag) : data,
            width: width.value - 20,
            height: height.value - 20,
          });
        } catch (e) {
          console.log(e);
        }
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
  filter: invert(100%) hue-rotate(210deg) brightness(133%);
  color: black;
  user-select: none;
}
.top-right-legend {
  transform: translateY(20px);
}
</style>
