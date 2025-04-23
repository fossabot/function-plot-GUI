<template>
  <s-page theme="auto" id="soberpage">
    <s-drawer>
      <Navbar @toggle-drawer="toogleDrawer" />
      <s-drawer
        theme="auto"
        id="content"
        :class="{ onresize: onResize }"
        ref="innerDrawer"
      >
        <div slot="start" id="editor" :style="{ width: sideRatio + 'vw' }">
          <div class="editor-inner">
            <VueDraggable
              v-model="graphData"
              :animation="150"
              handle=".datablock-drag"
            >
              <DataBlock
                v-for="(dataItem, i) in graphData"
                v-model="graphData[i]"
                @delete="graphData.splice(i, 1)"
                :key="dataItem.key"
                @require-full-update="fullUpdate"
              />
            </VueDraggable>
            <div class="plot-data add-data">
              <div
                @click="
                  graphData.push({
                    key: Math.random(),
                    fnType: 'linear',
                    graphType: 'polyline',
                  })
                "
                class="add-data-opt add"
              >
                + {{ t("buttons.add") }}
              </div>
              <div @click="handleImport()" class="add-data-opt import">
                ↓ {{ t("buttons.import") }}
              </div>
            </div>
          </div>
          <CodeDisplay :dataArr="toOriginalDatum(graphData)" />
        </div>
        <div id="divider" @mousedown="handleDrag"></div>
        <div id="graph" ref="shellRef">
          <Graph
            :data="toOriginalDatum(graphData)"
            :width="graphWidth"
            :height="graphHeight"
            :key="key"
            @requireFullUpdate="fullUpdate"
            @requirePostUpdate="key++"
            v-model="fullUpdateState"
          />
        </div>
      </s-drawer>
    </s-drawer>
  </s-page>
</template>

<script setup lang="ts">
import "sober";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import Navbar from "./components/nav.vue";
import Graph from "./components/graph.vue";
import DataBlock from "./components/dataBlock.vue";
import CodeDisplay from "./components/codeDisplay.vue";
import { VueDraggable } from "vue-draggable-plus";
import type { FunctionPlotDatum } from "function-plot";
import { onMounted, ref } from "vue";
import JSON5 from "json5";
import base64 from "base-64";
import utf8 from "utf8";
import { InternalDatum, toInternalDatum, toOriginalDatum } from "./consts";
import { throttle } from "lodash-es";

const graphData = ref<InternalDatum[]>([
  { fnType: "linear", graphType: "polyline", fn: "x^2", key: 1 },
]);

const innerDrawer = ref<HTMLElementTagNameMap["s-drawer"]>();

const graphWidth = ref(0),
  graphHeight = ref(0);
const key = ref(0);
const fullUpdateState = ref(false);
const sideRatio = ref(33);
const onResize = ref(false);

const shellRef = ref<HTMLDivElement>();
onMounted(()=>{
  const observer = new ResizeObserver(throttle(() => {
    graphWidth.value = shellRef.value!.clientWidth;
    graphHeight.value = shellRef.value!.clientHeight;
  }, 250));
  observer.observe(shellRef.value!);
})


function fullUpdate() {
  fullUpdateState.value = true;
  key.value++;
}

onMounted(() => {
  const rawCode = window.location.search.match(/\?code=(.+)$/)?.[1];
  if (rawCode)
    try {
      const code = utf8.decode(base64.decode(decodeURIComponent(rawCode)));
      const data = toInternalDatum(
        (JSON5.parse(code).data as FunctionPlotDatum[]) ?? []
      );
      graphData.value = toInternalDatum(<FunctionPlotDatum[]>data);
      console.log(code);
      console.log(data);
    } catch (e) {}
});

function handleDrag() {
  onResize.value = true;
  const xfull = window.innerWidth;
  const mousemove = (event: MouseEvent) =>
    (sideRatio.value = (event.clientX / xfull) * 100);
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", mousemove);
    onResize.value = false;
  });
}
function toogleDrawer() {
  innerDrawer.value?.toggle();
}
function handleImport() {
  const raw = prompt("源数据：");
  if (!raw) return;
  graphData.value = toInternalDatum(
    (JSON5.parse(raw).data as FunctionPlotDatum[]) ?? []
  );
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#soberpage {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
#content {
  flex-grow: 1;
  display: flex;
}
#editor {
  border-right: var(--c-border) 1px solid;
  position: relative;
  display: flex;
  flex-direction: column;
}
.editor-inner {
  overflow: scroll;
  flex-grow: 1;
}

#graph {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}
.add-data {
  padding: 0;
  display: flex;
  flex-direction: row;
}
.add-data-opt {
  padding: 10px 30px;
}
.add-data-opt.add {
  flex-grow: 1;
}
.add-data-opt:not(:nth-child(1)) {
  border-left: 1px solid var(--c-border);
}
.editor-inner {
  padding-bottom: 50px;
}
.add-data-opt:hover {
  background: var(--c-bk3);
}
.add-data-opt:active {
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
