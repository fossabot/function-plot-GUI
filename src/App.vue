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
            <s-scroll-view>
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

              <div
                class="plot-data add-data"
                @click="
                  graphData.push({
                    key: Math.random(),
                    fnType: 'linear',
                    graphType: 'polyline',
                  })
                "
              >
                <s-icon name="add" />
                {{ t("buttons.add") }}
                <s-ripple attached></s-ripple>
              </div>
            </s-scroll-view>

            <s-tooltip class="data-import">
              <s-fab slot="trigger" @click.stop="handleImport()">
                <s-icon>
                  <svg viewBox="0 -960 960 960">
                    <path
                      d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"
                    ></path>
                  </svg>
                </s-icon>
              </s-fab>
              {{ t("buttons.import") }}
            </s-tooltip>
          </div>
          <CodeDisplay :dataArr="toOriginalDatum(graphData)" />
          <div id="divider" @mousedown="handleDrag"></div>
        </div>
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
import { debounce } from "lodash-es";

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
s-page {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
* {
  --s-color-outline: #6a757a;
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
  margin-right: 3px; /* 为宽度调节条留空间 */
}
.editor-inner {
  height: 0;
  flex-grow: 1;
  position: relative;
}

.editor-inner s-scroll-view {
  height: 100%;
}

#graph {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.plot-data.add-data {
  position: relative;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-bottom: 50px;
  display: flex;
  gap: 5px;
}

.data-import {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

#divider {
  position: absolute;
  right: -3px;
  top: 0;
  bottom: 0;
  width: 5px;
  background: var(--c-accent);
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
