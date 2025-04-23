<template>
  <div
    v-for="input in fnType.coord?.filter(
      ({ folded }) => !(folded && blockFolded)
    ) ?? []"
    class="input-box coord"
    :class="{ optional: input.optional }"
  >
    <span class="coord-label">{{ t(input.label) + input.fir }}</span>
    <input
      type="number"
      :value="dataItem[input.value]?.[0] ?? ''"
      @input="handleCoordInput(dataItem!, input, 0, $event)"
      :placeholder="t(input.placeholder[0])"
    />
    <span class="coord-label">{{ input.sep }}</span>
    <input
      type="number"
      :value="dataItem[input.value]?.[1] ?? ''"
      @input="handleCoordInput(dataItem!, input, 1, $event)"
      :placeholder="t(input.placeholder[1])"
    />
    <span class="coord-label">{{ input.fin }}</span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { CoordType, InternalDatum, InputProps } from "../../consts";

const { dataItem, fnType } = defineProps<InputProps>();

function handleCoordInput(
  dataItem: InternalDatum,
  input: CoordType,
  index: 0 | 1,
  event: Event
) {
  const raw = (<HTMLInputElement>event.target).value;
  const newVal = Number(raw);
  const key = input.value,
    defaultVal = input.defaultVal ?? [0, 0];
  if (!dataItem[key]) {
    const coord: [number, number] = [...defaultVal];
    coord[index] = newVal;
    dataItem[key] = coord;
  } else {
    if (raw !== "") dataItem[key][index] = newVal;
    else if (dataItem[key][1 - index] !== defaultVal[1 - index])
      dataItem[key][index] = defaultVal[index];
    else delete dataItem[key];
  }
}
</script>

<style>
.input-box.coord {
  display: flex;
}
.input-box.coord.optional {
  color: var(--c-text2);
}
.input-box.coord span {
  font-size: 18px;
  margin: auto 5px;
  flex-shrink: 0;
}
.input-box.coord input {
  max-width: 8em;
  min-width: 3em;
  padding: 6px 0;
  font-size: 18px;
  flex-shrink: 1;
}
</style>
