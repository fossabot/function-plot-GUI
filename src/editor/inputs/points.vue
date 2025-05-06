<template>
  <PointsInput v-model="self.points" />
  <s-divider>{{ t("title.moreOptions") }}</s-divider>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
import PointsInput from "./subblocks/pointsInput.vue";
const { t } = useI18n();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Points;
  index: number;
}>();
const self = toRef(props, "self");
</script>
