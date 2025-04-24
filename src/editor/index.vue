<template>
  <div class="editor-inner">
    <s-scroll-view>
      <VueDraggable
        v-model="profile.data"
        :animation="200"
        handle=".datablock-drag"
        :key="draggerKey"
      >
        <Datum
          v-for="(dataItem, i) in profile.data"
          v-model="profile.data[i]"
          @delete="profile.data.splice(i, 1)"
          :key="dataItem.key"
        />
      </VueDraggable>
      <div class="plot-data add-data" @click="profile.data.push(getNewDatum())">
        <s-icon name="add" />
        {{ t("buttons.add") }}
        <s-ripple attached></s-ripple>
      </div>
    </s-scroll-view>
    <ImportBtn />
  </div>
  <OutputDrawer />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

import { VueDraggable } from "vue-draggable-plus";
import ImportBtn from "./import.vue";
import Datum from "./datum.vue";
import OutputDrawer from "./output.vue";

import { getNewDatum } from "@/consts";
import { useProfile } from "@/App.vue";
const profile = useProfile();

import { ref, watch } from "vue";
const draggerKey = ref(0);
watch(locale, () => draggerKey.value++);
</script>
