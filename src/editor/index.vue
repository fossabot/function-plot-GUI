<template>
  <div id="editor">
    <s-tab v-model.lazy="currentTab">
      <s-tab-item v-for="(item, index) in tabs" :value="String(index)">
        <div slot="text">{{ t(item.caption) }}</div>
      </s-tab-item>
    </s-tab>
    <div id="editor-inner">
      <Transition :name="transitionName">
        <component :is="tabs[currentTabIndex].component" />
      </Transition>
      <ImportBtn />
    </div>
  </div>
  <OutputDrawer />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import ImportBtn from "./import.vue";
import DataList from "./dataList.vue";
import AnnotaionList from "./annotationList.vue";
import GraphOptions from "./options.vue";

import OutputDrawer from "./output.vue";

import { computed, ref, watch } from "vue";
const currentTab = ref("0");
const currentTabIndex = computed(() => Number(currentTab.value));
const transitionName = ref("");
const tabs = [
  { caption: "title.functions", component: DataList },
  { caption: "title.annotations", component: AnnotaionList },
  { caption: "title.graphOptions", component: GraphOptions },
];
watch(currentTabIndex, (newVal, oldVal) => {
  if (newVal > oldVal) transitionName.value = "slide-left";
  else transitionName.value = "slide-right";
});
</script>

<style>
#editor {
  display: flex;
  flex-direction: column;
}
#editor-inner {
  height: 0;
  flex-grow: 1;
  position: relative;
}
#editor-inner s-scroll-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform var(--s-motion-duration-medium2)
    var(--s-motion-easing-emphasized);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-enter-to {
  transform: translateX(0);
}
.slide-right-leave-from {
  transform: translateX(0);
}
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-enter-to {
  transform: translateX(0);
}
.slide-left-leave-from {
  transform: translateX(0);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
