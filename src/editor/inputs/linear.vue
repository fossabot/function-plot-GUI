<template>
  <div class="input-inner">
    <div class="field main-fn">
      <span class="label styled">y=</span>
      <filledTextfield class="styled fn" label="f(x)" v-model="self.fn">
      </filledTextfield>
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

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Linear;
  index: number;
}>();
const self = toRef(props, "self");

import FilledTextfield from "@/ui/components/filled-textfield.vue";
</script>

<style lang="scss">
.input-inner {
  display: flex;
  flex-direction: column;

  .field.main-fn {
    display: flex;
    align-items: center;
    font-size: 25px;
    .label {
      margin: 0 0.1em -0.1em 0;
      width: 1.8em;
      margin-left: 0;
      text-align: right;
    }
    .fn {
      font-size: 22px;
      width: 0;
      flex-grow: 1;
    }
  }
}
</style>
