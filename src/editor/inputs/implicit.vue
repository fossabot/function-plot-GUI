<template>
  <s-empty>Implicit</s-empty>
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

const allowedGraphType = ["interval"] as const;
type AllowedGraphType = typeof allowedGraphType[number];
function isAllowedGraphType(type: string): type is AllowedGraphType {
  return (allowedGraphType as readonly string[]).includes(type);
}


onMounted(() => {
  if (dataItem.value.fnType !== "implicit") {
    dataItem.value = {
      fnType: "implicit",
      graphType: isAllowedGraphType(dataItem.value.graphType)
        ? dataItem.value.graphType
        : allowedGraphType[0],
      fn: "x-y",
      key: dataItem.value.key,
    };
  }
});
</script>
