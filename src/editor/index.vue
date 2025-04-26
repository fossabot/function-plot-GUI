<template>
  <div id="editor">
    <s-tab v-model.lazy="currentTab">
      <s-tab-item value="0">
        <div slot="text">{{ t("title.functions") }}</div>
      </s-tab-item>
      <s-tab-item value="1">
        <div slot="text">{{ t("title.graphOptions") }}</div>
      </s-tab-item>
    </s-tab>
    <div id="editor-inner">
      <Transition :name="transitionName">
        <DatumList v-show="currentTabIndex === 0" />
      </Transition>
      <Transition :name="transitionName">
        <GraphOptions v-show="currentTabIndex === 1" />
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
import DatumList from "./datumList.vue";
import GraphOptions from "./options.vue";
import OutputDrawer from "./output.vue";

import { computed, ref, watch } from "vue";
const currentTab = ref("0");
const currentTabIndex = computed(() => Number(currentTab.value));
const transitionName = ref("");

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
