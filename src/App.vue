<template>
  <s-page
    :theme="theme.initialValue"
    id="soberpage"
    ref="soberPage"
    :class="theme.value"
  >
    <s-drawer>
      <Navbar @toggle-drawer="toogleDrawer" />
      <s-drawer id="content" :class="{ onDrawerResize }" ref="innerDrawer">
        <div slot="start" id="drawer" :style="{ width: drawerSize + 'px' }">
          <Editor />
          <div id="divider" @pointerdown="handleDrawerResize"></div>
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

import { computed, ref, watch, watchEffect } from "vue";
import { useTheme } from "@/states";
const theme = useTheme();
const soberPage = ref<HTMLElementTagNameMap["s-page"]>();
watchEffect(() =>
  soberPage.value?.toggle(
    theme.value,
    document.getElementById("themeTrigger") ?? undefined
  )
);

// Drawer toogle
const innerDrawer = ref<HTMLElementTagNameMap["s-drawer"]>();
const toogleDrawer = () => innerDrawer.value?.toggle();

// Drawer resize
import { useWindowSize } from "@vueuse/core";
const { width: windowWidth } = useWindowSize();
const toSize = (percent: number) => (percent / 100) * windowWidth.value;

const drawerMinSize = computed(() => 450);
const drawerMaxSize = computed(() => toSize(75));

const restrictRange = (x: number) =>
  Math.min(Math.max(drawerMinSize.value, x), drawerMaxSize.value);

const drawerSize = ref(restrictRange(toSize(25)));
const onDrawerResize = ref(false);

watch(windowWidth, () => (drawerSize.value = restrictRange(drawerSize.value)));

function handleDrawerResize() {
  onDrawerResize.value = true;

  const mousemove = (event: MouseEvent) =>
    (drawerSize.value = restrictRange(event.clientX));
  const mouseup = () => {
    document.body.removeEventListener("pointermove", mousemove);
    document.body.removeEventListener("pointerup", mouseup);
    onDrawerResize.value = false;
  };
  document.body.addEventListener("pointermove", mousemove);
  document.body.addEventListener("pointerup", mouseup);
}
</script>

<style>
html,
body,
:root {
  margin: 0;
  padding: 0;
  overflow: hidden;
  user-select: none;
}
s-page {
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
#drawer {
  border-right: var(--s-color-outline-variant) 1px solid;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-right: 3px; /* 为宽度调节条留空间 */
}
#editor {
  height: 0;
  flex-grow: 1;
  position: relative;
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
