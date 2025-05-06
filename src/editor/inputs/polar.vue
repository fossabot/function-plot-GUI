<template>
  <div class="input-inner">
    <div class="field main-fn">
      <span class="label styled">ρ=</span>
      <s-text-field
        class="styled fn"
        ref="inputBox"
        label="f(θ)"
        v-model="self.r"
      >
      </s-text-field>
    </div>
  </div>
  <s-fold :folded="props.folded">
    <s-divider>{{ t("title.moreOptions") }}</s-divider>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora ab hic
      accusamus iure natus expedita laborum ea nam, reiciendis obcaecati animi
      voluptatem nisi assumenda ipsam nihil fuga minima? Id, ab?
    </p>
  </s-fold>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Polar;
  index: number;
}>();
const self = toRef(props, "self");
</script>
