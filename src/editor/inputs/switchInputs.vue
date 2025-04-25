<template>
  <div
    v-for="input in fnType.switches?.filter(
      ({ folded }) => !!folded === blockFolded
    ) ?? []"
    class="input-box switches"
    @click="
      dataItem[input.value]
        ? delete dataItem[input.value]
        : (dataItem[input.value] = true)
    "
  >
    <s-switch :checked="dataItem[input.value]"></s-switch>
    {{ t(input.label) }}
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { InputPropsWithFold } from "../../consts";

const { dataItem, fnType } = defineProps<InputPropsWithFold>();
</script>

<style>
.input-box.switches {
  align-items: center;
  gap: 15px;
  padding-left: 5px;
  cursor: default;
}
</style>
