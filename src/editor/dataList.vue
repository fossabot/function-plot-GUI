<template>
  <s-scroll-view ref="scrollView" class="list-view">
    <VueDraggable
      v-model="profile.datum"
      :animation="200"
      handle=".datablock-drag"
    >
      <AnimatedList>
        <AnimatedListItem
          v-for="(item, i) in profile.datum"
          :key="item.key"
          class="datumFolder"
        >
          <DataItem :self="item" :index="i" />
        </AnimatedListItem>
      </AnimatedList>
    </VueDraggable>
    <button class="plot-data add-data" @click="addData">
      <s-icon name="add" />
      {{ t("editor.add") }}
      <s-ripple attached></s-ripple>
    </button>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

import { VueDraggable } from "vue-draggable-plus";

import AnimatedList from "@/ui/animated/animatedList.vue";
import AnimatedListItem from "@/ui/animated/animatedListItem.vue";
import DataItem from "./data.vue";

import { useProfile } from "@/states";
const profile = useProfile();

import "./inputs/inputs.scss";
import { ref } from "vue";

const scrollView = ref<HTMLElementTagNameMap["s-scroll-view"] | null>(null);
function addData() {
  profile.addData();
  setTimeout(() => {
    if (!scrollView.value) return;
    const lastInput = (<HTMLInputElement[]>[
      ...scrollView.value.querySelectorAll(".function-input-real"),
    ]).at(-1);
    if (!lastInput) return;
    lastInput.focus();
    console.log(lastInput);
  }, 250);
}
</script>

<style lang="scss">
.datumFolder {
  border-bottom: var(--s-color-outline-variant) 1px solid;
}

.list-view {
  display: flex;
  align-items: stretch;
  flex-direction: column;
}

.plot-data.add-data {
  position: relative;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border-radius: 0;
  background: transparent;
  border: none;
  font-size: inherit;
  color: inherit;
  line-height: 1;
  transition: color 0.1s;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--s-color-primary);
    opacity: 0;
    transition: opacity 0.1s;
  }

  &:hover ::before {
    opacity: 0 !important;
  }

  &:focus-visible {
    outline: none;
    color: var(--s-color-primary);
  }

  &:focus-visible::before {
    opacity: 0.1;
  }

  s-icon {
    color: inherit;
  }
}
</style>
