<template>
  <div class="input-inner">
    <div class="field main-fn">
      <span class="label styled">ρ=</span>
      <FilledTextfield
        class="styled fn"
        ref="inputBox"
        label="f(θ)"
        v-model="self.r"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import { PrivateDataTypes } from "@/types/data";
import FilledTextfield from "@/editor/inputs/subblocks/function.vue";
import { toRef } from "vue";
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

const props = defineProps<{
  folded: boolean;
  self: PrivateDataTypes.Polar;
  index: number;
}>();
const self = toRef(props, "self");
</script>
