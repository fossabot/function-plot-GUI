<template>
  <div
    v-if="!blockFolded"
    v-for="input in fnType.optInput ?? []"
    class="input-box opt-input optional"
  >
    <span class="coord-label optin-label">{{ t(input.label) }}</span>
    <s-text-field
      :type="input.type"
      :value="(dataItem[input.value] ?? '') + ''"
      @input="handleCoordInput(dataItem!, input, $event)"
      :label="t(input.placeholder ?? '')"
    >
    </s-text-field>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { InternalDatum, InputProps, OptInput } from "../../consts";

const { dataItem, fnType } = defineProps<InputProps>();

function handleCoordInput(
  dataItem: InternalDatum,
  input: OptInput,
  event: Event
) {
  const raw = (<HTMLInputElement>event.target).value;
  if (raw === "") {
    delete dataItem[input.value];
    return;
  }
  if (input.type === "number") dataItem[input.value] = Number(raw);
  else dataItem[input.value] = raw;
}
</script>

<style>
.input-box.opt-input {
  display: flex;
  color: var(--s-color-on-surface-variant);
  gap: 10px;
  justify-content: space-between;
}
.input-box.opt-input span {
  font-size: 16px;
  margin: auto 5px;
  flex-shrink: 0;
}
.input-box.opt-input s-text-field {
  min-width: 3em;
  max-width: 16em;
  font-size: 17px;
  flex-shrink: 1;
}
</style>
