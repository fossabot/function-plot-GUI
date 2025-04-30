<template>
  <div class="input-inner">
    <span class="input-title styled">y=</span>
    <s-text-field class="styled" ref="inputBox" label="f(x)"> </s-text-field>
    <s-fold :folded="prop.folded">
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
import { InternalDatum } from "@/consts";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const dataItem = defineModel<InternalDatum>({ required: true });
const prop = defineProps<{
  folded: boolean;
}>();

onMounted(() => {
  if (dataItem.value.fnType !== "linear") {
    console.log("format to linear");
  }
});
</script>
