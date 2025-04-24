<template>
  <div id="graph" ref="shellRef">
    <Graph
      :data="toOriginalDatum(graphData)"
      :width="graphWidth"
      :height="graphHeight"
      :key="graphKey"
      @requireFullUpdate="fullUpdate"
      @requirePostUpdate="graphKey++"
      v-model="fullUpdateState"
    />
  </div>
</template>

<script setup lang="ts">
import Graph from "./graph.vue";
import { debounce } from "lodash-es";

const graphWidth = ref(0),
  graphHeight = ref(0);
const graphKey = ref(0);
const fullUpdateState = ref(false);

const shellRef = ref<HTMLDivElement>();
onMounted(() => {
  const observer = new ResizeObserver(
    debounce(() => {
      graphWidth.value = shellRef.value!.clientWidth;
      graphHeight.value = shellRef.value!.clientHeight;
    }, 250)
  );
  observer.observe(shellRef.value!);
});

function fullUpdate() {
  fullUpdateState.value = true;
  graphKey.value++;
}
</script>
