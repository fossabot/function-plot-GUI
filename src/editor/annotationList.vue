<template>
  <s-scroll-view>
    <AnimatedList>
      <AnimatedListItem
        v-for="(item, index) in profile.annotations"
        :key="item.key"
      >
        <Annotation
          :index="index"
          :annotation="item"
          class="datumFolder"
          :key="item.key"
        />
      </AnimatedListItem>
    </AnimatedList>
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

import AnimatedList from "@/ui/animatedList/animatedList.vue";
import AnimatedListItem from "@/ui/animatedList/animatedListItem.vue";
import Annotation from "./annotation.vue";

import { useProfile } from "@/states";
const profile = useProfile();
</script>
