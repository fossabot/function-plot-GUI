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
  console.log("FullUpdate:", str, `, lastIsError:`, lastIsError.value);
});
const handlePostUpdate = (str: string) => {
  graphKey.value++;
  console.log("PostUpdate:", str, `, lastIsError:`, lastIsError.value);
};
</script>
