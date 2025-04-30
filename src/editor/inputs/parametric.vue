<template>
  <s-empty>parametric</s-empty>
</template>

<script setup lang="ts">
import { InternalDatum } from "@/consts";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const dataItem = defineModel<InternalDatum>({ required: true });
const prop = defineProps<{
  folded: boolean;
}>();

onMounted(() => {
  if (dataItem.value.fnType !== "parametric") {
  }
});
</script>