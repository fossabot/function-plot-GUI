<template>
  <s-scroll-view>
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
          <DataItem :self="item" :index="i"  />
        </AnimatedListItem>
      </AnimatedList>
    </VueDraggable>
    <div class="plot-data add-data" @click="profile.addData">
      <s-icon name="add" />
      {{ t('editor.add') }}
      <s-ripple attached></s-ripple>
    </div>
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
</script>

<style>
.datumFolder {
  border-bottom: var(--s-color-outline-variant) 1px solid;
}

.plot-data.add-data {
  position: relative;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-bottom: 50px;
  display: flex;
  gap: 5px;
  cursor: pointer;
}
</style>
