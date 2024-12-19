<template>
  <div
    v-if="!blockFolded"
    v-for="input in fnType.optInput ?? []"
    class="input-box opt-input optional"
  >
    <span class="coord-label optin-label">{{ input.label }}</span>
    <input
      :type="input.type"
      :value="dataItem[input.value] ?? ''"
      @input="handleCoordInput(dataItem!, input, $event)"
      :placeholder="input.placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { Datum, InputProps, OptInput } from "../../consts";

const { dataItem, fnType } = defineProps<InputProps>();

function handleCoordInput(dataItem: Datum, input: OptInput, event: Event) {
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
  color: var(--c-text2);
  gap: 10px;
}
.input-box.opt-input span {
  font-size: 16px;
  margin: auto 5px;
  flex-shrink: 0;
}
.input-box.opt-input input {
  min-width: 3em;
  padding: 5px 0;
  font-size: 17px;
  flex-shrink: 1;
}
</style>
