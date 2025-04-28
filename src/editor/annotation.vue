<template>
  <div class="plot-data">
    <s-segmented-button v-model.lazy="props.annotation.axis">
      <s-segmented-button-item value="y">{{
        t("annotation.horizontal")
      }}</s-segmented-button-item>
      <s-segmented-button-item value="x">
        {{ t("annotation.vertical") }}
      </s-segmented-button-item>
    </s-segmented-button>
    <s-text-field
      class="styled"
      type="number"
      v-model="props.annotation.value"
    ></s-text-field>
    <s-text-field
      :label="t('annotation.text')"
      v-model.lazy="props.annotation.text"
    ></s-text-field>
  </div>
</template>

<script setup lang="ts">
import { InternalAnnotation } from "@/consts";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  index: number;
  annotation: InternalAnnotation;
}>();

import emitter from "@/mitt";
import { watch } from "vue";
watch([() => props.annotation.axis, () => props.annotation.text], () =>
  emitter.emit("require-post-update", "anntaions axis change")
);
</script>
