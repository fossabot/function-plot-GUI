<template>
  <Navbar />
  <div id="content">
    <div id="editor">
      <div class="editor-inner">
        <DataBlock
          v-for="(_dataItem, i) in graphData"
          v-model="graphData[i]"
          @delete="graphData.splice(i, 1)"
        />
        <div class="plot-data add-data" @click="graphData.push({})">+ 添加</div>
      </div>
      <div class="plot-data output">
        <span class="output-title">代码</span>
        <pre>{{ formatted }}</pre>
      </div>
    </div>
    <Graph :key="cnt" :graphData="graphData" ref="graphRef" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/nav.vue";
import Graph from "./components/graph.vue";
import DataBlock from "./components/dataBlock.vue";
import type { FunctionPlotDatum } from "function-plot";
import { reactive, ref, watch } from "vue";
import JSON5 from "json5";
import prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginPostcss from "prettier/plugins/postcss";

const graphRef = ref<InstanceType<typeof Graph>>();
const graphData = reactive<FunctionPlotDatum[]>([{ fn: "x^2" }]);
const cnt = ref(0);
const formatted = ref("");
watch(
  graphData,
  () => {
    cnt.value++;
    prettier
      .format(JSON5.stringify({ data: graphData }), {
        parser: "json5",
        printWidth: 40,
        plugins: [
          prettierPluginBabel,
          prettierPluginEstree,
          prettierPluginPostcss,
        ],
      })
      .then((value) => (formatted.value = value));
  },
  { immediate: true, deep: true }
);
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
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}
#content {
  width: 100vw;
  flex-grow: 1;
  display: flex;
  max-height: calc(100vh - 50px);
}
#navbar {
  height: 50px;
  width: 100vw;
  background: var(--c-bk1);
  border-bottom: var(--c-border) 1px solid;
  position: relative;
  flex-shrink: 0;
}
#editor {
  width: 33vw;
  border-right: var(--c-border) 1px solid;

  position: relative;
}
.editor-inner {
  overflow: scroll;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 300px;
}
#graph {
  width: 60vw;
  position: relative;
}
.add-data {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 50px;
}
.add-data:hover {
  background: var(--c-bk3);
}
.add-data:active {
  background: var(--c-bk1);
}
.plot-data.output {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: var(--c-border) 1px solid;
  padding: 20px 15px;
  height: 260px;
}
.plot-data.output .output-title {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}
.plot-data.output pre {
  position: absolute;
  top:60px;
  bottom:15px;
  left:15px;
  right:15px;
  margin: 0;
  overflow: scroll;
  user-select: all;
}
</style>
