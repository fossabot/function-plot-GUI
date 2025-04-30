<template>
  <div class="plot-data annotation">
    <div class="selectors">
      <s-segmented-button v-model.lazy="props.annotation.axis">
        <s-segmented-button-item value="y">{{
          t("annotation.horizontal")
        }}</s-segmented-button-item>
        <s-segmented-button-item value="x">
          {{ t("annotation.vertical") }}
        </s-segmented-button-item>
      </s-segmented-button>
      <div class="grow"></div>
      <div class="dataBlockBtns">
        <s-tooltip>
          <s-icon-button
            slot="trigger"
            @click="deleteAnnotation"
            style="color: var(--s-color-error)"
          >
            <SIconDelete />
          </s-icon-button>
          {{ t("buttons.del") }}
        </s-tooltip>
        <s-tooltip>
          <s-icon-button
            slot="trigger"
            :type="showText ? 'filled-tonal' : 'standard'"
            @click="showText = !showText"
          >
            <SIconTextfield />
          </s-icon-button>
          {{ t("annotation.text") }}
        </s-tooltip>
        <span class="annotation-drag drag-icon">
          <SIconDrag />
        </span>
      </div>
    </div>

    <div class="annotation-texts" :class="{ showText }">
      <s-text-field
        class="styled annotation-value"
        type="number"
        v-model="props.annotation.value"
        :label="props.annotation.axis + '='"
      ></s-text-field>
      <Transition name="anntextslide">
        <s-text-field
          v-if="showText"
          class="annotation-textfield"
          :label="t('annotation.text')"
          v-model="props.annotation.text"
        ></s-text-field>
      </Transition>
    </div>
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
import { ref, watch } from "vue";
watch([() => props.annotation.axis, () => props.annotation.text], () =>
  emitter.emit("require-full-update", "annotations axis change")
);

import SIconDelete from "@/ui/icons/delete.vue";
import SIconDrag from "@/ui/icons/drag.vue";
import SIconTextfield from "@/ui/icons/textfield.vue";

import { useProfile } from "@/states";
const profile = useProfile();
function deleteAnnotation() {
  emitter.emit("require-full-update", "annotations axis change");
  profile.annotations.splice(props.index, 1);
}

const showText = ref(props.annotation.text !== "");

watch(showText, (value) => {
  if (!value) props.annotation.text = "";
});
</script>

<style>
.plot-data.annotation {
  display: flex;
  flex-direction: column;
}
.annotation-value {
  font-size: 20px;
}
.annotation-textfield {
  font-size: 16px;
}
.annotation-texts {
  display: flex;
  gap: 10px;
  padding-top: 8px;
  overflow: hidden;
}
.annotation-texts s-text-field {
  width: 0;
  flex-grow: 1;
}
</style>

<style>
.anntextslide-enter-from,
.anntextslide-leave-to {
  flex-grow: 0 !important;
  margin-left: -10px;
}

.anntextslide-leave-active {
  transition:
    flex-grow var(--s-motion-duration-medium1) var(--s-motion-easing-emphasized),
    margin-left var(--s-motion-duration-medium1)
      var(--s-motion-easing-emphasized) 0.2s;
}

.anntextslide-enter-active {
  transition:
    flex-grow var(--s-motion-duration-medium1) var(--s-motion-easing-emphasized),
    margin-left var(--s-motion-duration-medium1)
      var(--s-motion-easing-emphasized);
}
</style>
