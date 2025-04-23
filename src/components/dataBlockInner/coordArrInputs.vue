<template>
  <VueDraggable
    class="coordarr-wrapper styled"
    v-if="fnType.coordArr"
    v-model="privateData"
    :animation="300"
    handle="span.coordarr-drag"
  >
    <div
      v-for="(data, index) in privateData"
      class="input-box coord coordarr"
      :key="data.id"
    >
      <span class="coordarr-drag">
        <s-icon name="menu">
          <svg viewBox="0 -960 960 960">
            <path
              d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"
            ></path>
          </svg>
        </s-icon>
      </span>

      <span class="coord-label">{{
        t(fnType.coordArr.label) + fnType.coordArr.fir
      }}</span>
      <s-text-field
        type="number"
        class="styled"
        v-model="data.payload[0]"
        :label="t(fnType.coordArr.placeholder[0])"
      >
      </s-text-field>
      <span class="coord-label">{{ fnType.coordArr.sep }}</span>
      <s-text-field
        type="number"
        class="styled"
        v-model="data.payload[1]"
        :label="t(fnType.coordArr.placeholder[1])"
      >
      </s-text-field>
      <span class="coord-label">{{ fnType.coordArr.fin }}</span>
      <s-icon-button @click="privateData.splice(index, 1)">
        <s-icon>
          <svg viewBox="0 -960 960 960">
            <path
              d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
            ></path>
          </svg>
        </s-icon>
      </s-icon-button>
    </div>
  </VueDraggable>
  <s-button
    v-if="fnType.coordArr"
    type="text"
    class="add-coord"
    @click="
      privateData.push({
        id: Math.random(),
        payload: [0, 0],
      })
    "
  >
    <s-icon slot="start" name="add"></s-icon> {{ t("buttons.addPoint") }}
  </s-button>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { InputProps } from "../../consts";
import { onMounted, ref, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";

const { dataItem, fnType } = defineProps<InputProps>();

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
  gap: 0.8rem;
}

.coordarr-drag {
  cursor: grab;
  margin: 0 0 !important;
  line-height: 2.5em;
  border-radius: 5px;
}

.sortable-chosen > .coordarr-drag {
  background: var(--s-color-outline-variant);
  z-index: 999;
}
.add-coord {
  margin-left: 25px;
  width: fit-content;
}

.coordarr-wrapper s-text-field {
  width: 0;
  flex-grow: 1;
  font-size: 20px;
}
</style>
