<template>
  <s-scroll-view>
    <VueDraggable
      v-model="profile.data"
      :animation="200"
      handle=".datablock-drag"
    >
      <Datum
        v-for="(dataItem, i) in profile.data"
        v-model="profile.data[i]"
        :index="i"
        :key="dataItem.key"
      />
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

import Datum from "./datum.vue";

import { getNewDatum } from "@/consts";
import { useProfile } from "@/consts";
const profile = useProfile();
</script>
