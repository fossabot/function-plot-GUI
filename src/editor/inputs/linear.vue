<template>
  <div class="input-inner">
    <span class="input-title styled">y=</span>
    <s-text-field class="styled" ref="inputBox" label="f(x)" v-model="self.fn">
    </s-text-field>
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
import { PrivateData, PrivateDataTypes } from "@/types/data";
import { onMounted, Ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  folded: boolean;
  self: PrivateData;
}>();
const self = toRef(props, "self") as Ref<PrivateDataTypes.Linear>;


onMounted(() => {
});
</script>
