<template>
  <div id="graph" ref="shellRef">
    <Graph
      :key="graphKey"
      v-model="fullUpdateState"
      @require-post-update="handlePostUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import Graph from "./graph.vue";
import { ref } from "vue";

const graphKey = ref(0);
const fullUpdateState = ref(false);
const shellRef = ref<HTMLDivElement>();

import emitter from "@/mitt";
emitter.on("require-full-update", (str) => {
  fullUpdateState.value = true;
  graphKey.value++;
  if (import.meta.env.DEV)
    console.log(`fullUpdateState: ${fullUpdateState.value}, ${str}`);
});
const handlePostUpdate = (str: string) => {
  fullUpdateState.value = false;
  graphKey.value++;
  if (import.meta.env.DEV)
    console.log(`postUpdateState: ${fullUpdateState.value}, ${str}`);
};
</script>
