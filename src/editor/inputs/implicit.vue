<template>
  <s-empty>Implicit</s-empty>
</template>

<script setup lang="ts">
import { PrivateData, PrivateDataTypes } from "@/types/data";
import { onMounted, Ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  folded: boolean;
  self: PrivateData;
  index: number;
}>();
const self = toRef(props, "self") as Ref<PrivateDataTypes.Implicit>;
onMounted(() => {
  const original = self.value as PrivateData;
  if (original.fnType !== "implicit") {
    const isAllowedGraphType = (
      value: string
    ): value is PrivateDataTypes.Implicit["graphType"] =>
      ["interval"].includes(value);
    const graphType = isAllowedGraphType(original.graphType)
      ? original.graphType
      : "interval";
    self.value = {
      skipTip: false,
      nSamples: undefined,
      closed: false,
      ...original,
      fnType: "implicit",
      fn: "",
      graphType,
    };
  }
});
</script>
