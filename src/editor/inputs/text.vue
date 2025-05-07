<template>
  <span class="input-title styled">r=</span>
  <s-text-field
    class="styled"
    ref="inputBox"
    label="f(x,y)"
    v-model="self.text"
  ></s-text-field>
  <s-text-field
    class="styled"
    ref="inputBox"
    label="x"
    v-model="self.location[0]"
  ></s-text-field>
  <s-text-field
    class="styled"
    ref="inputBox"
    label="y"
    v-model="self.location[1]"
  ></s-text-field>
  <s-divider>{{ t("title.moreOptions") }}</s-divider>
</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Text;
  index: number;
}>();
const self = toRef(props, "self");
</script>
