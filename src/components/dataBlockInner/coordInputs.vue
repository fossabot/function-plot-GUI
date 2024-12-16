<template>
  <div
    v-for="input in fnType.coord?.filter(
      ({ folded }) => !(folded && blockFolded)
    ) ?? []"
    class="input-box coord"
    :class="{ optional: input.optional }"
  >
    <span class="coord-label">{{ input.label }}</span>
    <input
      type="number"
      :value="dataItem[input.value]?.[0] ?? ''"
      @input="handleCoordInput(dataItem!, input, 0, $event)"
      :placeholder="input.placeholder[0]"
    />
    <span class="coord-label">{{ input.sep }}</span>
    <input
      type="number"
      :value="dataItem[input.value]?.[1] ?? ''"
      @input="handleCoordInput(dataItem!, input, 1, $event)"
      :placeholder="input.placeholder[1]"
    />
    <span class="coord-label">{{ input.fin }}</span>
  </div>
</template>

<script setup lang="ts">
import { FnType, CoordType } from "../../consts";
import { FunctionPlotDatum } from "function-plot";

const { dataItem, fnType } = defineProps<{
  dataItem: FunctionPlotDatum;
  fnType: FnType;
  blockFolded: boolean;
}>();

function handleCoordInput(
  dataItem: FunctionPlotDatum,
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
