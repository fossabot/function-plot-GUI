<template>
  <div class="input-inner">
    <div class="field main-fn">
      <FilledTextfield
        class="styled fn"
        label="F(x, y)"
        v-model="self.fn"
      />
      <span class="label styled"> =0 </span>
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
const { t } = useI18n();

import FilledTextfield from "@/editor/inputs/subblocks/function.vue";

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Implicit;
  index: number;
}>();
const self = toRef(props, "self");
</script>
