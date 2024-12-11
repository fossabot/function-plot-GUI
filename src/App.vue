<template>
  <Navbar />
  <div id="content">
    <div id="editor" @click="graphData.push({ fn: 'sin(x)' })">{{ graphData }}</div>
    <Graph :graphData="graphData" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/nav.vue";
import Graph from "./components/graph.vue";
import type { FunctionPlotDatum } from "function-plot";

import { reactive, ref, watch } from "vue";
const graphData = ref([{ fn: 'x^2' }]);
const cnt = ref(0);
watch(graphData, () => cnt.value++,{deep:true});
</script>

<style>
#app {
  position: fixed;
  margin: 0;
  padding: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}
#content {
  width: 100vw;
  flex-grow: 1;
  display: flex;
}
#navbar {
  height: 50px;
  width: 100vw;
  background: #fff3;
  position: relative;
}

#editor {
  width: 40vw;
}
#graph {
  width: 60vw;
  position: relative;
}
</style>
