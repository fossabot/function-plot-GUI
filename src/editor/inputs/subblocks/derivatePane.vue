<template>
  <div class="derivate-pane">
    <s-tab mode="fixed" v-model.lazy="tab">
      <s-tab-item value="derivate">
        <div slot="text" class="tab-text">
          切线设置
          <Transition name="badge">
            <s-badge class="tab-badge" v-if="derivateEnabled"></s-badge>
          </Transition>
        </div>
      </s-tab-item>
      <s-tab-item value="secant">
        <div slot="text" class="tab-text">
          割线设置
          <Transition name="badge">
            <s-badge class="tab-badge" v-if="secantEnabled"></s-badge>
          </Transition>
        </div>
      </s-tab-item>
    </s-tab>

    <!-- derivate -->
    <div
      class="content"
      v-if="tab === 'derivate'"
      :class="{ enabled: derivateEnabled }"
    >
      <div class="field no-opacity">
        <div class="label">启用切线显示</div>
        <s-switch type="checkbox" v-model.lazy="derivateEnabled"></s-switch>
      </div>
      <div class="field main-fn">
        <span class="label wide styled">y'=</span>
        <FunctionField class="styled fn" label="f'(x)" v-model="derivateFn" />
      </div>
      <div class="field">
        <div class="label">切点位置</div>
        <s-segmented-button v-model.lazy="derivFollowMouseStr">
          <s-segmented-button-item value="followMouse">
            跟随鼠标
          </s-segmented-button-item>
          <s-segmented-button-item value="manual">
            指定切点
          </s-segmented-button-item>
        </s-segmented-button>
      </div>
      <s-fold :folded="derivFollowMouse" class="derivate-x-coord-fold">
        <div class="field x-coord-field">
          <div class="label">切点横坐标</div>
          <s-text-field
            class="x-coord styled"
            type="number"
            label="x"
            v-model="derivateX"
          ></s-text-field>
        </div>
      </s-fold>
    </div>

    <!-- secant -->
    <div class="content" v-else :class="{ enabled: secantEnabled }">
      <div class="field no-opacity">
        <div class="label">启用割线显示</div>
        <s-switch type="checkbox" v-model.lazy="secantEnabled"></s-switch>
      </div>
      <div class="secants">
        <AnimatedList>
          <AnimatedListItem v-for="(item, index) in secantArr" :key="item.key">
            <div class="secant-item">
              <s-checkbox
                type="checkbox"
                v-model="item.followMouse"
                class="secant-checkbox"
              >
                跟随鼠标
              </s-checkbox>
              <s-text-field
                class="sec-coord styled-inner"
                type="number"
                label="x₁"
                v-model="item.x1"
              ></s-text-field>
              <Transition name="field-squeeze">
                <s-text-field
                  v-if="!item.followMouse"
                  class="sec-coord styled-inner"
                  type="number"
                  label="x₂"
                  v-model="item.x2"
                ></s-text-field>
              </Transition>
              <s-icon-button
                @click="secantArr.splice(index, 1)"
                class="secant-delete"
              >
                <SIconDelete />
              </s-icon-button>
            </div>
          </AnimatedListItem>
        </AnimatedList>
      </div>
      <s-button
        class="add-secant"
        type="text"
        @click="
          secantArr.push({
            key: Math.random(),
            followMouse: true,
            x1: 0,
            x2: '',
          })
        "
      >
        <s-icon slot="start" name="add" /> 添加
      </s-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PrivateDataTypes } from "@/types/data";
import { computed, reactive, ref, toRef } from "vue";
import FunctionField from "./function.vue";

import AnimatedList from "@/ui/animated/animatedList.vue";
import AnimatedListItem from "@/ui/animated/animatedListItem.vue";
import SIconDelete from "@/ui/icons/delete.vue";

const props = defineProps<{
  self: PrivateDataTypes.Linear;
}>();

const tab = ref("derivate");
const self = toRef(props, "self");

const derivateEnabled = ref(false);
const derivateFn = ref("");
const derivFollowMouseStr = ref("followMouse");
const derivFollowMouse = computed(
  () => derivFollowMouseStr.value === "followMouse"
);
const derivateX = ref(0);

const secantEnabled = ref(false);
const secantArr = reactive<
  {
    key: number;
    followMouse: boolean;
    x1: number | "";
    x2: number | "";
  }[]
>([]);
</script>

<style lang="scss">
.derivate-pane {
  width: 25em;
  s-tab {
    background-color: var(--s-color-surface-container-low);
  }
  .tab-text {
    display: flex;
    align-items: center;
  }
  .tab-badge {
    background-color: var(--s-color-success);
    color: var(--s-color-on-success);
    margin-left: 0.8em;
  }
  .badge {
    &-enter-active,
    &-leave-active {
      transition:
        opacity 0.1s,
        margin-left 0.5s cubic-bezier(0, 1, 0, 1);
    }
    &-leave-to,
    &-enter-from {
      opacity: 0;
      margin-left: -8px;
    }
  }
  .content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.8em;
    &.enabled {
      .field,
      .secants,
      .add-secant {
        opacity: 1;
      }
    }
    .field,
    .secants,
    .add-secant {
      opacity: 0.5;
      transition: opacity 0.2s;
    }
  }
  .field {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .no-opacity {
    opacity: 1 !important;
  }
  .field.main-fn {
    font-size: 1.5em;
    .label.wide {
      width: 2.2em;
    }
  }
  .x-coord.styled {
    font-size: 20px;
    max-width: 10em;
  }
  .derivate-x-coord-fold {
    margin-top: -0.8em;
    .x-coord-field {
      margin-top: 0.8em;
    }
  }
  .secants {
    display: flex;
    flex-direction: column;
    margin: 0 -0.5em 0 -1em;
  }
  .secant-item {
    display: flex;
    align-items: center;
    margin: 0.3em 0;
    padding-left: 1em;
    gap: 0.5em;
  }
  .sec-coord {
    width: 0;
    flex-grow: 1;
    font-size: 20px !important;
  }
  .secant-delete {
    flex-shrink: 0;
    margin-left: -0.2em;
  }
  .secant-checkbox {
    margin-right: 0.3em;
  }
  .field-squeeze {
    &-enter-active,
    &-leave-active {
      transition:
        flex-grow 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
        width 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
        margin-left 0.35s 0.05s;
      min-width: 0;
      overflow-x: hidden;
    }
    &-enter-active {
      transition:
        flex-grow 0.3s var(--s-motion-easing-emphasized),
        width 0.3s var(--s-motion-easing-emphasized),
        margin-left 0.05s;
    }
    &-enter-from,
    &-leave-to {
      flex-grow: 0 !important;
      width: 0 !important;
      margin-left: -0.5em;
    }
  }
  .add-secant {
    margin-top: -0.3em;
  }
}
</style>
