<template>
  <span class="input-title styled">r=</span>
  <s-text-field class="styled" ref="inputBox" label="f(x,y)" v-model="self.r">
  </s-text-field>
  <s-divider>{{ t("title.moreOptions") }}</s-divider>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Polar;
  index: number;
}>();
const self = toRef(props, "self");
</script>
