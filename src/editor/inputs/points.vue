<template>
  <div class="input-inner">
    <PointsInput v-model="self.points" />
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
        <div class="switches">
          <!-- closed -->
          <s-checkbox
            type="checkbox"
            v-model.lazy="self.closed"
            :disabled="self.graphType === 'scatter'"
          >
            {{ t("data.more.closed") }}
          </s-checkbox>
        </div>
      </div>
    </AnimatedFold>
  </div>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
import PointsInput from "./subblocks/pointsInput.vue";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Points;
  index: number;
}>();
const self = toRef(props, "self");

import HelpIcon from "./subblocks/helpIcon.vue";
import ColorPicker from "./subblocks/colorPicker.vue";
import AnimatedFold from "@/ui/animated/animatedFold.vue";
</script>
