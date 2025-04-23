<template>
  <div class="plot-data output" :class="{ collapse }">
    <span class="output-title"
      >{{ t("title.output") }}
      <button class="codeCollapse" @click="collapse = !collapse">
        {{ t(collapse ? "buttons.expand" : "buttons.collapse") }}
      </button>
    </span>
    <pre>{{ formatted }}</pre>
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

const collapse = ref(true);
</script>

<style>
.plot-data.output {
  border-top: var(--c-border) 1px solid;
  padding: 15px 15px;
  height: 260px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}
.plot-data.output .output-title {
  font-size: 20px;
  font-weight: bold;
  display: block;
}
.plot-data.output pre {
  flex-grow: 1;
  overflow: scroll;
  user-select: all;
  margin: 0;
}

.plot-data.output.collapse {
  height: 30px;
}

.codeCollapse{
  float: right;
  height:100%;
  padding:0 10px;
  background: var(--c-bk3);
  border:var(--c-border) 1px solid;
  border-radius: 5px;
  opacity: 0.75;
}
.codeCollapse:hover{
  opacity: 1;
}
.codeCollapse:active{
  opacity: 1;
  filter: brightness(0.5);
}
</style>
