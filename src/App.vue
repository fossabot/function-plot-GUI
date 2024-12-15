<template>
  <Navbar />
  <div id="content" :class="{ onresize: onResize }">
    <div id="editor" :style="{ width: sideRatio + 'vw' }">
      <div class="editor-inner">
        <VueDraggable v-model="graphData" :animation="150" handle=".datablock-drag">
          <DataBlock
            v-for="(dataItem, i) in graphData"
            v-model="graphData[i]"
            @delete="graphData.splice(i, 1)"
            :key="dataItem.key"
          />
        </VueDraggable>
        <div
          class="plot-data add-data"
          @click="graphData.push({ key: Math.random() })"
        >
          + 添加
        </div>
      </div>
      <CodeDisplay :dataArr="cloneDeep(graphData)" />
    </div>
    <div id="divider" @mousedown="handleDrag"></div>
    <div id="graph" ref="shellRef">
      <Graph
        :graphData="cloneDeep(graphData)"
        :width="graphWidth"
        :height="graphHeight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/nav.vue";
import Graph from "./components/graph.vue";
import DataBlock from "./components/dataBlock.vue";
import CodeDisplay from "./components/codeDisplay.vue";
import { VueDraggable } from "vue-draggable-plus";
import type { FunctionPlotDatum } from "function-plot";
import { onMounted, ref } from "vue";
import { cloneDeep } from "lodash-es";
const graphData = ref<(FunctionPlotDatum & { key: number })[]>([
  { fn: "x^2", key: 1 },
]);
const graphWidth = ref(0),
  graphHeight = ref(0);
const sideRatio = ref(33);
const onResize = ref(false);
const shellRef = ref<HTMLDivElement>();
function handleResize() {
  if (shellRef.value) {
    graphWidth.value = shellRef.value.clientWidth;
    graphHeight.value = shellRef.value.clientHeight;
  }
}
onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});
function handleDrag() {
  onResize.value = true;
  const xfull = outerWidth;
  const mousemove = (event: MouseEvent) =>
    (sideRatio.value = (event.clientX / xfull) * 100);
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", mousemove);
    onResize.value = false;
    handleResize();
  });
}
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
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}
.add-data {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 50px;
  cursor: default;
}
.add-data:hover {
  background: var(--c-bk3);
}
.add-data:active {
  background: var(--c-bk1);
}

#divider {
  width: 6px;
  background: var(--c-accent);
  margin-left: -3px;
  margin-right: -3px;
  z-index: 999;
  opacity: 0;
  transition: opacity 0.1s;
  cursor: w-resize;
}
#divider:hover {
  opacity: 0.8;
}
.onresize #divider {
  opacity: 0.3;
  transition: none;
}
.onresize {
  cursor: w-resize;
  user-select: none;
}
</style>
