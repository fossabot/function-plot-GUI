<template>
  <s-page theme="auto" id="soberpage">
    <s-drawer>
      <Navbar @toggle-drawer="toogleDrawer" />
      <s-drawer
        theme="auto"
        id="content"
        :class="{ onDrawerResize }"
        ref="innerDrawer"
      >
        <div
          slot="start"
          id="editor"
          :style="{ width: drawerSizeRatio + 'vw' }"
        >
          <Editor />
          <div id="divider" @mousedown="handleDrawerResize"></div>
        </div>
        <Graph />
      </s-drawer>
    </s-drawer>
  </s-page>
</template>

<script setup lang="ts">
import Navbar from "./ui/navbar.vue";
import Graph from "./graph/index.vue";
import Editor from "./editor/index.vue";

// Datum define
import { defineStore } from "pinia";
import { ref } from "vue";
import { InternalDatum, toOriginalDatum } from "@/consts";
export const useProfile = defineStore("profile", () => {
  const data = ref<InternalDatum[]>([
    { fnType: "linear", graphType: "polyline", fn: "x^2", key: 1 },
  ]);
  const getOriginalCopy = () => toOriginalDatum(data.value);
  return { data, getOriginalCopy };
});

// Drawer toogle
const innerDrawer = ref<HTMLElementTagNameMap["s-drawer"]>();
const toogleDrawer = () => innerDrawer.value?.toggle();

// Drawer resize
const drawerSizeRatio = ref(33);
const onDrawerResize = ref(false);
function handleDrawerResize() {
  onDrawerResize.value = true;
  const xfull = window.innerWidth;
  const restrictRange = (x: number, min: number, max: number) =>
    Math.max(min, Math.min(x, max));
  const toRatio = (x: number) => (x / xfull) * 100;
  const mousemove = (event: MouseEvent) =>
    (drawerSizeRatio.value = restrictRange(toRatio(event.clientX), 25, 75));
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", mousemove);
    onDrawerResize.value = false;
  });
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
  border-right: var(--s-color-outline-variant) 1px solid;
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
  background: var(--s-color-secondary);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.1s;
  cursor: w-resize;
}
#divider:hover {
  opacity: 0.8;
}
.onDrawerResize #divider {
  opacity: 0.3;
  transition: none;
}
.onDrawerResize {
  cursor: w-resize;
  user-select: none;
}
</style>
