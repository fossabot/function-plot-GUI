<template>
  <s-scroll-view>
    <VueDraggable
      v-model="profile.annotations"
      :animation="200"
      handle=".annotation-drag"
      @end="afterDragged"
    >
      <AnimatedList>
        <AnimatedListItem
          v-for="(item, index) in profile.annotations"
          :key="item.key"
        >
          <Annotation :index="index" class="datumFolder" />
        </AnimatedListItem>
      </AnimatedList>
    </VueDraggable>
    <div class="plot-data add-data" @click="profile.addAnnotation">
      <s-icon name="add" />
      {{ t("buttons.add") }}
      <s-ripple attached></s-ripple>
    </div>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import AnimatedList from "@/ui/animated/animatedList.vue";
import AnimatedListItem from "@/ui/animated/animatedListItem.vue";
import { VueDraggable } from "vue-draggable-plus";
import Annotation from "./annotation.vue";

import { useProfile } from "@/states";
const profile = useProfile();

import emitter from "@/mitt";
const afterDragged = () =>
  emitter.emit("require-full-update", "annotations order change");
</script>
