<template>
  <div class="input-inner">
    <div class="field main-fn">
      <span class="label styled">y=</span>
      <filledTextfield class="styled fn" label="f(x)" v-model="self.fn" />
    </div>
    <s-fold :folded="props.folded">
      <s-divider>{{ t("title.moreOptions") }}</s-divider>
      <div class="input-inner-optional">
        <div class="fields">
          <span class="label">
            颜色 <HelpIcon> 支持颜色名称 / RGB(A) / HEX </HelpIcon>
          </span>
          <ColorPicker v-model="self.color" />
          <span class="label">采样数</span>
          <s-text-field
            class="input monospace"
            type="number"
            label="采样数"
            v-model="self.nSamples"
            :min="1"
            @blur="if (!self.nSamples) self.nSamples = undefined;"
          ></s-text-field>
        </div>
        <div class="switches">
          <s-checkbox type="checkbox" v-model.lazy="self.closed">
            闭合并填充
          </s-checkbox>
          <s-checkbox type="checkbox" v-model.lazy="self.skipTip">
            不显示指示条
            <HelpIcon> 鼠标经过时标出的点及其坐标 </HelpIcon>
          </s-checkbox>
        </div>
      </div>
    </s-fold>
  </div>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Linear;
  index: number;
}>();
const self = toRef(props, "self");

import FilledTextfield from "./subblocks/function.vue";
import HelpIcon from "./subblocks/helpIcon.vue";
import ColorPicker from "./subblocks/colorPicker.vue";
import "./inputs.scss";
</script>
