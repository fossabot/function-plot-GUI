<template>
  <Graph
    :key="graphKey"
    v-model="lastIsError"
    @require-post-update="handlePostUpdate"
  />
</template>

<script setup lang="ts">
import Graph from "./graph.vue";
import { ref } from "vue";

const graphKey = ref(0);
const lastIsError = ref(false);

import emitter from "@/mitt";
emitter.on("require-full-update", (str) => {
  graphKey.value++;
  if (import.meta.env.DEV)
    console.log(`lastIsError: ${lastIsError.value}, ${str}`);
});
const handlePostUpdate = (str: string) => {
  graphKey.value++;
  if (import.meta.env.DEV)
    console.log(`postUpdateState: ${lastIsError.value}, ${str}`);
};
</script>
