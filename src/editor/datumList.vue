<template>
  <s-scroll-view>
    <VueDraggable
      v-model="profile.data"
      :animation="200"
      handle=".datablock-drag"
    >
      <AnimatedList>
        <AnimatedListItem
          v-for="(dataItem, i) in profile.data"
          :key="dataItem.key"
          class="datumFolder"
        >
          <Datum v-model="profile.data[i]" :index="i" />
        </AnimatedListItem>
      </AnimatedList>
    </VueDraggable>
    <div class="plot-data add-data" @click="profile.data.push(getNewDatum())">
      <s-icon name="add" />
      {{ t("buttons.add") }}
      <s-ripple attached></s-ripple>
    </div>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { VueDraggable } from "vue-draggable-plus";

import AnimatedList from "@/ui/animatedList/animatedList.vue";
import AnimatedListItem from "@/ui/animatedList/animatedListItem.vue";
import Datum from "./datum.vue";

import { getNewDatum } from "@/consts";
import { useProfile } from "@/consts";
const profile = useProfile();
</script>

<style>
.datumFolder {
  border-bottom: var(--s-color-outline-variant) 1px solid;
}
</style>
