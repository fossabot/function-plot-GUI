<template>
  <div class="plot-data output">
    <span class="output-title">{{ t("title.output") }} </span>
    <s-fold folded>
      <s-button
        slot="trigger"
        type="text"
        @click="folded = !folded"
        id="codeFoldButton"
      >
        <s-icon
          slot="start"
          :name="folded ? 'chevron_up' : 'chevron_down'"
        ></s-icon>
        {{ t(folded ? "buttons.expand" : "buttons.collapse") }}</s-button
      >
      <pre id="formattedCode">{{ formatted }}</pre>
    </s-fold>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import JSON5 from "json5";
import prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import { ref, watch } from "vue";
import { FunctionPlotDatum } from "function-plot";
const { dataArr } = defineProps<{
  dataArr: FunctionPlotDatum[];
}>();
const formatted = ref("");
watch(
  () => dataArr,
  () => {
    prettier
      .format(JSON5.stringify({ data: dataArr }), {
        parser: "json5",
        printWidth: 40,
        plugins: [prettierPluginBabel, prettierPluginEstree],
      })
      .then((value) => (formatted.value = value));
  },
  { immediate: true }
);

const folded = ref(true);
</script>

<style>
.plot-data.output {
  border-top: var(--s-color-outline-variant) 1px solid;
  padding: 8px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}
.plot-data.output .output-title {
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  top: 8px;
  left: 15px;
  line-height: 40px;
}
.plot-data.output pre {
  flex-grow: 1;
  overflow: scroll;
  user-select: all;
  margin: 0;
}
#codeFoldButton {
  margin-left: 100%;
  transform: translateX(-100%);
}
#formattedCode {
  height: 200px;
}
</style>
