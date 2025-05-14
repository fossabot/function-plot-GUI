<template>
  <div class="input-inner text">
    <div class="fields">
      <span class="input-title">{{ t("data.main.text") }}</span>
      <s-text-field
        v-model="self.text"
        :label="t('data.main.text')"
        class="text-input-box"
      ></s-text-field>
      <span class="input-title">{{ t("data.main.location") }}</span>
      <div class="tuple">
        <span class="tuple-label styled">(</span>
        <s-text-field
          class="styled tuple-input"
          label="x₀"
          v-model="locationX"
          type="number"
        ></s-text-field>
        <span class="tuple-label styled">,</span>
        <s-text-field
          class="styled tuple-input"
          label="y₀"
          v-model="locationY"
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
  self: PrivateDataTypes.Text;
  index: number;
}>();
const self = toRef(props, "self");

import AnimatedFold from "@/ui/animated/animatedFold.vue";
import HelpIcon from "./subblocks/helpIcon.vue";
import ColorPicker from "./subblocks/colorPicker.vue";

const locationX = ref<number | "">(self.value.location[0]);
const locationY = ref<number | "">(self.value.location[1]);

watch(locationX, (val) => (self.value.location[0] = val || 0));
watch(locationY, (val) => (self.value.location[1] = val || 0));
</script>

<style lang="scss">
.text-input-box {
  width: 100%;
  font-size: 18px;
}
</style>
