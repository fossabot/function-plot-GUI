<template>
  <div class="input-inner">
    <div class="field main-fn">
      <span class="label styled">x=</span>
      <FunctionField class="fn" label="f(t)" v-model="self.x" />
    </div>
    <div class="field main-fn">
      <span class="label styled">y=</span>
      <FunctionField class="fn" label="g(t)" v-model="self.y" />
    </div>
    <AnimatedFold :folded="props.folded">
      <s-divider>{{ t("data.more.dividerTitle") }}</s-divider>
      <div class="input-inner-optional">
        <div class="fields">
          <!-- range -->
          <span class="label"> {{ t("data.more.range") }} </span>
          <Domain :self="self" :defaultMin="0" :defaultMax="2 * Math.PI" />
          <!-- color -->
          <span class="label">
            {{ t("data.more.color") }}
            <HelpIcon> {{ t("data.more.colorHelp") }} </HelpIcon>
          </span>
          <ColorPicker v-model="self.color" />
          <!-- nSamples -->
          <span class="label"> {{ t("data.more.nSamples") }} </span>
          <s-text-field
            class="input monospace-inner"
            type="number"
            :label="t('data.more.nSamples')"
            v-model="self.nSamples"
            :min="1"
            @blur="if (!self.nSamples) self.nSamples = undefined;"
          ></s-text-field>
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
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

import FunctionField from "@/editor/inputs/subblocks/function.vue";
import HelpIcon from "./subblocks/helpIcon.vue";
import ColorPicker from "./subblocks/colorPicker.vue";
import Domain from "./subblocks/domain.vue";
import AnimatedFold from "@/ui/animated/animatedFold.vue";

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Parametric;
  index: number;
}>();
const self = toRef(props, "self");
</script>
