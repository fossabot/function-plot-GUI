<template>
  <div id="graphRender" ref="plotRef"></div>
  <button id="refresh" @click="emit('requireFullUpdate')">重置</button>
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

#refresh {
  color: var(--c-text);
  padding: 6px 10px;
  border: none;
  background: var(--c-bk3);
  border-radius: 5px;
  opacity: 0.75;
  border: var(--c-border) 1px solid;
  position: absolute;
  top: 25px;
  right: 25px;
}
#refresh:hover {
  opacity: 1;
}
#refresh:active {
  opacity: 1;
  filter: brightness(0.5);
}
</style>
