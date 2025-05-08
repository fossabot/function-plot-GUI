<template>
  <div class="input-inner">
    <div class="field main-fn">
      <FunctionField class="fn" label="f(x, y)" v-model="self.fn" />
      <span class="label styled"> =0 </span>
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
        <div class="switches">
          <!-- closed -->
          <s-checkbox
            type="checkbox"
            v-model.lazy="self.closed"
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

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Implicit;
  index: number;
}>();
const self = toRef(props, "self");

import FunctionField from "@/editor/inputs/subblocks/function.vue";
import AnimatedFold from "@/ui/animated/animatedFold.vue";
import ColorPicker from "./subblocks/colorPicker.vue";
import HelpIcon from "./subblocks/helpIcon.vue";
</script>
