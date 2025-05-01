<template>
  <div class="plot-data annotation">
    <div class="selectors">
      <s-segmented-button v-model.lazy="props.self.variable">
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
      <s-text-field
        class="styled value"
        type="number"
        v-model="props.self.value"
        :label="props.self.variable + '='"
      ></s-text-field>
      <Transition name="anntextslide">
        <s-text-field
          v-if="showText"
          class="text"
          :label="t('annotation.text')"
          v-model="props.self.text"
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
const profile = useProfile();
const props = defineProps<{
  index: number;
  self: PrivateAnnotation;
}>();

const showText = ref(props.self.text !== "");
watch(showText, (value) => {
  if (!value) props.self.text = "";
});

import emitter from "@/mitt";
import { ref, watch } from "vue";

watch([() => props.self.variable, () => props.self.text], () =>
  emitter.emit("require-full-update", "annotations axis change")
);

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
  gap: 10px;
  padding-top: 8px;
  overflow: hidden;

  s-text-field {
    width: 0;
    flex-grow: 1;
  }

  .value {
    font-size: 20px;
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
