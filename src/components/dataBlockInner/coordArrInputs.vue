<template>
  <VueDraggable
    class="coordarr-wrapper"
    v-if="fnType.coordArr"
    v-model="privateData"
    :animation="150"
    handle="span.coordarr-drag"
  >
    <div
      v-for="(data, index) in privateData"
      class="input-box coord coordarr"
      :key="data.id"
    >
      <span class="coordarr-drag">☰</span>
      <span class="coord-label">{{ fnType.coordArr.label }}</span>
      <input
        type="number"
        v-model="data.payload[0]"
        :placeholder="fnType.coordArr.placeholder[0]"
      />
      <span class="coord-label">{{ fnType.coordArr.sep }}</span>
      <input
        type="number"
        v-model="data.payload[1]"
        :placeholder="fnType.coordArr.placeholder[1]"
      />
      <span class="coord-label">{{ fnType.coordArr.fin }}</span>
      <span class="coordarr-delete" @click="privateData.splice(index, 1)">×</span>
    </div>
  </VueDraggable>
  <div
    v-if="fnType.coordArr"
    class="add-coord"
    @click="
      privateData.push({
        id: Math.random(),
        payload: [0, 0],
      })
    "
  >
    + 添加点
  </div>
</template>

<script setup lang="ts">
import { FnType } from "../../consts";
import { FunctionPlotDatum } from "function-plot";
import { computed, onMounted, ref, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";

const { dataItem, fnType } = defineProps<{
  dataItem: FunctionPlotDatum;
  fnType: FnType;
  blockFolded: boolean;
}>();

type PrivateData = {
  id: number;
  payload: [number, number];
};
const privateData = ref<PrivateData[]>([]);
onMounted(() => {
  privateData.value =
    dataItem[fnType.coordArr!.value]?.map((payload) => ({
      id: Math.random(),
      payload,
    })) ?? [];
  watch(
    privateData,
    () => {
      dataItem[fnType.coordArr!.value] = privateData.value.map(
        ({ payload }) => payload
      );
    },
    { deep: true }
  );
});
</script>

<style>
.coordarr {
  position: relative;
  align-items: center;
}

.coordarr-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.coordarr-delete {
  background-color: var(--c-bk3);
  --d: 1.2em;
  width: var(--d);
  height: var(--d);
  margin: auto 0;
  border-radius: 50%;
  line-height: var(--d);
  text-align: center;
	border:transparent 1px solid
}
.coordarr-delete:hover {
  opacity: 1;
	background-color: var(--c-red);
	border-color:var(--c-red2)
}
.coordarr-delete:active {
  opacity: 1;
  filter: brightness(0.5);
}

.coordarr-drag {
  background: var(--c-bk3);
  border: var(--c-border) 1px solid;
  border-top-color: var(--c-bk3);
  border-bottom-color: var(--c-bk3);
  margin: 0 0 !important;
  padding: 0 5px;
  line-height: 2.5em;
}
.coordarr-wrapper .coord:nth-child(1) .coordarr-drag {
  border-top-color: var(--c-border);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.coordarr-wrapper .coord:nth-last-child(1) .coordarr-drag {
  border-bottom-color: var(--c-border);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.sortable-chosen .coordarr-drag {
  background: var(--c-border);
  z-index: 999;
}
.add-coord {
  padding: 5px 15px;
  margin-left: 25px;
  margin-top: -5px;
  border-radius: 5px;
}
.add-coord:hover {
  background: var(--c-bk3);
}
.add-coord:active {
  background: var(--c-bk1);
}
</style>
