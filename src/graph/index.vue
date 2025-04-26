<template>
  <div id="graph" ref="shellRef">
    <Graph
      :data="graphData"
      :width="graphWidth"
      :height="graphHeight"
      :key="graphKey"
      v-model="fullUpdateState"
    />
  </div>
</template>

<script setup lang="ts">
import Graph from "./graph.vue";
import { computed, onMounted, ref } from "vue";
import { throttle } from "lodash-es";
import { useProfile } from "@/states";

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

const profile = useProfile();

const graphData = computed(() => {
  void profile.data;
  return profile.getOriginalCopy();
});

import emitter from "@/mitt";

emitter.on("require-full-update", () => {
  fullUpdateState.value = true;
  graphKey.value++;
});
emitter.on("require-post-update", () => {
  graphKey.value++;
});
</script>
