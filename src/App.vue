<template>
  <Navbar />
  <div id="content">
    <div id="editor">
      <div v-for="dataItem in graphData" class="plot-data">
        <select
          v-model="dataItem.fnType"
          @change="
            getFnType(dataItem.fnType).notAllowedInIntervel &&
              !dataItem.graphType &&
              (dataItem.graphType = 'polyline')
          "
        >
          <option :value="undefined">{{ fnTypeArr[0].label }}</option>
          <option v-for="type in fnTypeArr.slice(1)" :value="type.value">
            {{ type.label }}
          </option>
        </select>

        <select v-model="dataItem.graphType">
          <option
            v-if="!getFnType(dataItem.fnType).notAllowedInIntervel"
            :value="undefined"
          >
            {{ graphTypeArr[0].label }}
          </option>
          <option v-for="type in graphTypeArr.slice(1)" :value="type.value">
            {{ type.label }}
          </option>
        </select>
        <div class="input-wrapper">
          <input
            v-for="input in inputArr.filter(({ value }) => {
              const inputs = getFnType(dataItem.fnType).inputs;
              if (inputs.includes(value)) return true;
              else delete dataItem[value];
            })"
            type="text"
            v-model="dataItem[input.value]"
          />
        </div>
      </div>
      <div class="add-data" @click="graphData.push({})">+ 添加</div>
      {{ graphData }}
    </div>
    <Graph :graphData="graphData" />
  </div>
</template>

<script setup lang="ts">
import Navbar from "./components/nav.vue";
import Graph from "./components/graph.vue";
import type { FunctionPlotDatum } from "function-plot";
import { reactive } from "vue";
import { fnTypeArr, graphTypeArr, inputArr } from "./consts";
import type { FnType, ValueLabel } from "./consts";
const graphData = reactive<FunctionPlotDatum[]>([{ fn: "x^2" }]);
const getFnType = (fnType?: string) =>
  <FnType>fnTypeArr.find(({ value }) => value === (fnType || "linear"));
</script>

<style>
#app {
  position: fixed;
  margin: 0;
  padding: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
}
#content {
  width: 100vw;
  flex-grow: 1;
  display: flex;
}
#navbar {
  height: 50px;
  width: 100vw;
  background: #fff3;
  position: relative;
}

#editor {
  width: 40vw;
}
#graph {
  width: 60vw;
  position: relative;
}
</style>
