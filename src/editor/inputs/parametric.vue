<template>
  <div class="input-inner">
    <div class="field main-fn">
      <span class="label styled">x=</span>
      <FilledTextfield class="styled fn" label="f(t)" v-model="self.x" />
    </div>
    <div class="field main-fn">
      <span class="label styled">y=</span>
      <FilledTextfield class="styled fn" label="g(t)" v-model="self.y" />
    </div>
    <s-fold :folded="props.folded">
      <s-divider>{{ t("title.moreOptions") }}</s-divider>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora ab hic
        accusamus iure natus expedita laborum ea nam, reiciendis obcaecati animi
        voluptatem nisi assumenda ipsam nihil fuga minima? Id, ab?
      </p>
    </s-fold>
  </div>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

import FilledTextfield from "@/editor/inputs/subblocks/function.vue";

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Parametric;
  index: number;
}>();
const self = toRef(props, "self");
</script>
