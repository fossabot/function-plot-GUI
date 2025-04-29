<template>
  <div id="graph" ref="shellRef">
    <Graph
      :width="graphWidth"
      :height="graphHeight"
      :key="graphKey"
      v-model="fullUpdateState"
    />
  </div>
</template>

<script setup lang="ts">
import Graph from "./graph.vue";
import { onMounted, ref } from "vue";
import { throttle } from "lodash-es";

const graphWidth = ref(0),
  graphHeight = ref(0);
const graphKey = ref(0);
const fullUpdateState = ref(false);

const shellRef = ref<HTMLDivElement>();
onMounted(() => {
  const observer = new ResizeObserver(
    throttle(() => {
      graphWidth.value = shellRef.value!.clientWidth;
      graphHeight.value = shellRef.value!.clientHeight;
    }, 180)
  );
  observer.observe(shellRef.value!);
});

import emitter from "@/mitt";

emitter.on("require-full-update", (str) => {
  fullUpdateState.value = true;
  graphKey.value++;
  if (import.meta.env.DEV)
    console.log(`fullUpdateState: ${fullUpdateState.value}, ${str}`);
});
emitter.on("require-post-update", (str) => {
  fullUpdateState.value = false;
  graphKey.value++;
  if (import.meta.env.DEV)
    console.log(`postUpdateState: ${fullUpdateState.value}, ${str}`);
});
</script>
