<template>
  <div class="derivate-pane">
    <s-tab mode="fixed" v-model.lazy="tab">
      <s-tab-item value="derivate">
        <div slot="text">切线设置</div>
      </s-tab-item>
      <s-tab-item value="secant">
        <div slot="text">割线设置</div>
      </s-tab-item>
    </s-tab>

    <!-- derivate -->
    <div class="content" v-if="tab === 'derivate'">
      <div class="field">
        <div class="label">启用切线显示</div>
        <s-switch type="checkbox" v-model.lazy="derivateEnabled"></s-switch>
      </div>
      <div class="field main-fn">
        <span class="label styled">y'=</span>
        <FunctionField class="styled fn" label="f'(x)" v-model="derivateFn" />
      </div>
      <div class="field">
        <div class="label">切点位置</div>
        <s-segmented-button value="b">
          <s-segmented-button-item value="a"> 指定切点 </s-segmented-button-item>
          <s-segmented-button-item value="b"> 跟随鼠标 </s-segmented-button-item>
        </s-segmented-button>
      </div>
      <div class="field">
        <div class="label">切点横坐标</div>
        <s-text-field type="number" label="x" class="styled"></s-text-field>
      </div>
    </div>

    <!-- secant -->
    <div class="content" v-else>
      <div class="field">
        <div class="label">启用割线显示</div>
        <s-switch type="checkbox" v-model.lazy="secantEnabled"></s-switch>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { PrivateDataTypes } from "@/types/data";
import { ref, toRef } from "vue";
import FunctionField from "./function.vue";

const props = defineProps<{
  self: PrivateDataTypes.Linear;
}>();

const tab = ref("derivate");
const self = toRef(props, "self");

const derivateEnabled = ref(false);
const derivateFn = ref("");
const secantEnabled = ref(false);
</script>

<style lang="scss">
.derivate-pane {
  width: 25em;
  .content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  .field {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .field.main-fn {
    font-size: 1.5em;
    .label {
      width: 2.2em;
    }
  }
}
</style>
