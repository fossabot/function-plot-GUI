<template>
  <div
    v-for="input in fnType.switches?.filter(
      ({ folded }) => !(folded && blockFolded)
    ) ?? []"
    class="input-box switches"
    @click="
      dataItem[input.value]
        ? delete dataItem[input.value]
        : (dataItem[input.value] = true)
    "
  >
    <button class="switch" :class="dataItem[input.value] ? 'on' : 'off'"></button>
    {{ input.label }}
  </div>
</template>

<script setup lang="ts">
import { FnType } from "../../consts";
import { FunctionPlotDatum } from "function-plot";

const { dataItem, fnType } = defineProps<{
  dataItem: FunctionPlotDatum;
  fnType: FnType;
  blockFolded: boolean;
}>();
</script>

<style>
.input-box.switches {
  align-items: center;
  gap: 10px;
  padding-left: 5px;
  cursor: default;
}
.switch:before,
.switch:after {
  position: absolute;
  transition: all 0.2s cubic-bezier(0, 0.48, 0.27, 0.98);
}
.switch {
  width: 40px;
  height: 20px;
  border-radius: 5px;
  position: relative;
  border-radius: 10px;
  border:none
}
.switch.on {
  background: var(--c-accent);
}
.switch.off {
  background: var(--c-border);
}
.switch:after {
  content: "";
  background: #fff;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
.switch.off:after {
  left: 4px;
}
.switch.on:after {
  left: 24px;
}
.switches:hover .switch {
  filter: brightness(110%);
}
.switches:active .switch {
  filter: brightness(90%);
}
</style>
