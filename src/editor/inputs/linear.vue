<template>
  <div class="input-inner">
    <div class="field main-fn">
      <span class="label styled">y=</span>
      <FunctionField class="fn" label="f(x)" v-model="self.fn" />
    </div>
    <AnimatedFold :folded="props.folded">
      <s-divider>{{ t("data.more.dividerTitle") }}</s-divider>
      <div class="input-inner-optional">
        <div class="fields">
          <!-- Derivate & secants -->
          <span class="label"> {{ t("data.derivateAndSecants") }} </span>
          <s-popup class="derivate-popup input" align="right">
            <s-button type="outlined" slot="trigger">
              {{ t("data.derivateAndSecantsPane") }}
              <s-icon name="chevron_right" slot="end"></s-icon>
            </s-button>
            <DerivatePane :self="self" />
          </s-popup>
          <!-- range -->
          <span class="label"> {{ t("data.more.range") }} </span>
          <Domain :self="self" />
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
          <!-- skipTip -->
          <s-checkbox type="checkbox" v-model.lazy="self.skipTip">
            {{ t("data.more.skipTip") }}
            <HelpIcon> {{ t("data.more.skipTipHelp") }} </HelpIcon>
            <HelpIcon
              v-if="
                self.skipTip &&
                (self.derivative?.updateOnMouseMove ||
                  self.secants.some((s) => s.updateOnMouseMove))
              "
              type="warn"
            >
              {{ t("data.more.skipTipWarn") }}
            </HelpIcon>
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

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Linear;
  index: number;
}>();
const self = toRef(props, "self");

import FunctionField from "./subblocks/function.vue";
import HelpIcon from "./subblocks/helpIcon.vue";
import ColorPicker from "./subblocks/colorPicker.vue";
import Domain from "./subblocks/domain.vue";
import DerivatePane from "./subblocks/derivatePane.vue";
import AnimatedFold from "@/ui/animated/animatedFold.vue";
</script>
