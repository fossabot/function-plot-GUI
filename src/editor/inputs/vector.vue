<template>
  <div class="input-inner vector">
    <div class="fields">
      <span class="input-title">{{ t("data.main.vector") }}</span>
      <div class="tuple">
        <span class="tuple-label styled">(</span>
        <s-text-field
          class="styled tuple-input"
          label="Δx"
          v-model="vectorX"
          type="number"
        ></s-text-field>
        <span class="tuple-label styled">,</span>
        <s-text-field
          class="styled tuple-input"
          label="Δy"
          v-model="vectorY"
          type="number"
        ></s-text-field>
        <span class="tuple-label styled">)</span>
      </div>
      <span class="input-title">{{ t("data.main.offset") }}</span>
      <div class="tuple">
        <span class="tuple-label styled">(</span>
        <s-text-field
          class="styled tuple-input"
          label="x₀"
          v-model="offsetX"
          type="number"
        ></s-text-field>
        <span class="tuple-label styled">,</span>
        <s-text-field
          class="styled tuple-input"
          label="y₀"
          v-model="offsetY"
          type="number"
        ></s-text-field>
        <span class="tuple-label styled">)</span>
      </div>
    </div>
    <AnimatedFold :folded="props.folded">
      <s-divider>{{ t("data.more.dividerTitle") }}</s-divider>
      <div class="input-inner-optional">
        <div class="fields">
          <!-- color -->
          <span class="label">
            {{ t("data.more.color") }}
            <HelpIcon> {{ t("data.more.colorHelp") }} </HelpIcon>
          </span>
          <ColorPicker v-model="self.color" />
        </div>
      </div>
    </AnimatedFold>
  </div>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { ref, toRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Vector;
  index: number;
}>();
const self = toRef(props, "self");

import AnimatedFold from "@/ui/animated/animatedFold.vue";
import HelpIcon from "./subblocks/helpIcon.vue";
import ColorPicker from "./subblocks/colorPicker.vue";

const vectorX = ref<number | "">(self.value.vector[0]);
const vectorY = ref<number | "">(self.value.vector[1]);
const offsetX = ref<number | "">(self.value.offset[0] || "");
const offsetY = ref<number | "">(self.value.offset[1] || "");

watch(vectorX, (val) => (self.value.vector[0] = val || 0));
watch(vectorY, (val) => (self.value.vector[1] = val || 0));
watch(offsetX, (val) => (self.value.offset[0] = val || 0));
watch(offsetY, (val) => (self.value.offset[1] = val || 0));
</script>
