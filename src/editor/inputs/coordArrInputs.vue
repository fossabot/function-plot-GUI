<template>
  <VueDraggable
    class="coordarr-wrapper styled"
    v-if="fnType.coordArr"
    v-model="privateData"
    :animation="200"
    handle="span.coordarr-drag"
  >
    <TransitionGroup name="coord-trans">
      <div
        class="input-box coord coordarr"
        v-for="(data, index) in privateData"
        :key="data.id"
      >
        <span class="coordarr-drag">
          <SIconDragAlt />
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
          <SIconDelete />
        </s-icon-button>
      </div>
    </TransitionGroup>
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

import SIconDragAlt from "@/ui/icons/dragalt.vue";
import SIconDelete from "@/ui/icons/delete.vue";

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
  gap: 10px;
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

<style>
.coord-trans-enter-active,
.coord-trans-leave-active {
  transition:
    margin-bottom var(--s-motion-duration-short4)
      var(--s-motion-easing-emphasized),
    clip-path var(--s-motion-duration-short4) var(--s-motion-easing-emphasized);
}
.coord-trans-enter-to,
.coord-trans-leave-from {
  margin-bottom: 0;
  clip-path: inset(-10px 0 0 0);
}
.coord-trans-enter-from,
.coord-trans-leave-to {
  margin-bottom: -58px;
  clip-path: inset(-10px 0 100% 0);
}
</style>
