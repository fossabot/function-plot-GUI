<template>
  <div class="plot-data annotation">
    <div class="selectors">
      <s-segmented-button v-model.lazy="self.variable">
        <s-segmented-button-item value="y">
          {{ t("annotation.horizontal") }}
        </s-segmented-button-item>
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

    <div class="annotation-fields" :class="{ showText }">
      <div class="label-and-value">
        <span class="label styled"> {{ self.variable + "=" }} </span>
        <s-text-field
          class="styled-inner value"
          type="number"
          v-model="self.value"
          :label="t('annotation.value')"
          @blur="handleValueBlur"
        ></s-text-field>
      </div>
      <Transition name="anntextslide">
        <s-text-field
          v-if="showText"
          class="text"
          :label="t('annotation.text')"
          v-model="self.text"
        ></s-text-field>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import SIconDelete from "@/ui/icons/delete.vue";
import SIconDrag from "@/ui/icons/drag.vue";
import SIconTextfield from "@/ui/icons/textfield.vue";

import { useProfile } from "@/states";
import { PrivateAnnotation } from "@/types/annotation";

import { ref, toRef, watch } from "vue";

const profile = useProfile();
const props = defineProps<{
  index: number;
  self: PrivateAnnotation;
}>();
const self = toRef(props, "self");

const showText = ref(self.value.text !== "");
watch(showText, (value) => {
  if (!value) self.value.text = "";
});

import emitter from "@/mitt";

watch([() => self.value.variable, () => self.value.text], () =>
  emitter.emit("require-full-update", "annotations axis change")
);

function handleValueBlur() {
  self.value.value = Number(self.value.value);
}

function deleteAnnotation() {
  emitter.emit("require-full-update", "annotations axis change");
  profile.annotations.splice(props.index, 1);
}
</script>

<style lang="scss">
.plot-data.annotation {
  display: flex;
  flex-direction: column;
}

.annotation-fields {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
  overflow: hidden;

  s-text-field {
    width: 0;
    flex-grow: 1;
  }
  .label-and-value {
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 3px;
    .label {
      font-size: 25px;
      width: 1.9em;
      text-align: right;
      margin-bottom: -0.1em;
    }
    .value {
      font-size: 22px;
    }
  }
  .text {
    font-size: 16px;
  }
}

.anntextslide {
  &-enter-from,
  &-leave-to {
    flex-grow: 0 !important;
    margin-left: -10px;
  }

  &-leave-active {
    transition:
      flex-grow var(--s-motion-duration-medium1)
        var(--s-motion-easing-emphasized),
      margin-left var(--s-motion-duration-medium1)
        var(--s-motion-easing-emphasized) 0.2s;
  }

  &-enter-active {
    transition:
      flex-grow var(--s-motion-duration-medium1)
        var(--s-motion-easing-emphasized),
      margin-left var(--s-motion-duration-medium1)
        var(--s-motion-easing-emphasized);
  }
}
</style>
