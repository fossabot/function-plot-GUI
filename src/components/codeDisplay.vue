<template>
  <div class="plot-data output">
    <span class="output-title">代码</span>
    <pre>{{ formatted }}</pre>
  </div>
</template>

<script setup lang="ts">
import JSON5 from "json5";
import prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import { ref, watch } from "vue";
import { Datum } from "../consts";
const { dataArr } = defineProps<{
  dataArr: (Omit<Datum, "key"> & { key?: number })[];
}>();
const formatted = ref("");
watch(
  () => dataArr,
  () => {
    dataArr.forEach((item) => {
      if (item.graphType === "text") delete item.fnType;
      delete item.key;
    });
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
</script>

<style>
.plot-data.output {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: var(--c-border) 1px solid;
  padding: 20px 15px;
  height: 260px;
}
.plot-data.output .output-title {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}
.plot-data.output pre {
  position: absolute;
  top: 60px;
  bottom: 15px;
  left: 15px;
  right: 15px;
  margin: 0;
  overflow: scroll;
  user-select: all;
}
</style>
