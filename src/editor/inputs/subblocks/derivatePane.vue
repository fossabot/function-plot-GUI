<template>
  <div class="derivate-pane">
    <s-tab mode="fixed" v-model.lazy="tab">
      <s-tab-item value="derivate">
        <div slot="text" class="tab-text">
          {{ t("data.derivate.title") }}
          <Transition name="badge">
            <s-badge
              class="tab-badge"
              v-if="derivateEnabled"
              :class="{ error: derivateReady === undefined }"
            ></s-badge>
          </Transition>
        </div>
      </s-tab-item>
      <s-tab-item value="secant">
        <div slot="text" class="tab-text">
          {{ t("data.secant.title") }}
          <Transition name="badge">
            <s-badge
              class="tab-badge"
              v-if="secantEnabled"
              :class="{ error: secantReady.length === 0 }"
            ></s-badge>
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
        <div class="label">{{ t("data.derivate.enable") }}</div>
        <s-switch type="checkbox" v-model.lazy="derivateEnabled"></s-switch>
      </div>
      <div class="field main-fn">
        <span class="label wide styled">y'=</span>
        <FunctionField class="fn" label="f'(x)" v-model="derivateFn" />
      </div>
      <div class="field">
        <div class="label">{{ t("data.derivate.point") }}</div>
        <s-segmented-button v-model.lazy="derivFollowMouseStr">
          <s-segmented-button-item value="followMouse">
            {{ t("data.derivate.followMouse") }}
          </s-segmented-button-item>
          <s-segmented-button-item value="manual">
            {{ t("data.derivate.manual") }}
          </s-segmented-button-item>
        </s-segmented-button>
      </div>
      <AnimatedFold :folded="derivFollowMouse" class="derivate-x-coord-fold">
        <div class="field x-coord-field">
          <div class="label">{{ t("data.derivate.sepcify") }}</div>
          <s-text-field
            class="x-coord styled-inner"
            type="number"
            :label="t('data.derivate.xcoord')"
            v-model="derivateX"
          ></s-text-field>
        </div>
      </AnimatedFold>
    </div>

    <!-- secant -->
    <div class="content" v-else :class="{ enabled: secantEnabled }">
      <div class="field no-opacity">
        <div class="label">{{ t("data.secant.enable") }}</div>
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
                {{ t("data.secant.followMouse") }}
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
        <s-icon slot="start" name="add" /> {{ t("data.secant.add") }}
      </s-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PrivateDataTypes } from "@/types/data";
import { computed, reactive, ref, toRef, watch, watchEffect } from "vue";
import FunctionField from "./function.vue";

import AnimatedList from "@/ui/animated/animatedList.vue";
import AnimatedListItem from "@/ui/animated/animatedListItem.vue";
import SIconDelete from "@/ui/icons/delete.vue";
import AnimatedFold from "@/ui/animated/animatedFold.vue";

import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

const props = defineProps<{
  self: PrivateDataTypes.Linear;
}>();

const tab = ref("derivate");
const self = toRef(props, "self");

const initDerivate = self.value.derivative ?? {
  fn: "",
  updateOnMouseMove: true,
  x0: "" as number | "",
};

const derivateEnabled = ref(self.value.derivative !== undefined);
const derivateFn = ref(initDerivate.fn);
const derivFollowMouseStr = ref(
  initDerivate.updateOnMouseMove ? "followMouse" : "manual"
);
const derivFollowMouse = computed(
  () => derivFollowMouseStr.value === "followMouse"
);
const derivateX = ref<number | "">(initDerivate.x0 ?? "");
const derivateReady = computed(
  (): undefined | PrivateDataTypes.LinearPart.Derivative => {
    if (!derivateEnabled.value || !derivateFn.value) return undefined;
    if (derivFollowMouse.value)
      return {
        fn: derivateFn.value,
        updateOnMouseMove: true,
      };
    if (derivateX.value === "") return undefined;
    return {
      fn: derivateFn.value,
      updateOnMouseMove: false,
      x0: derivateX.value,
    };
  }
);
watch(derivateFn, (val) => {
  if (val !== "" && !derivateEnabled.value) derivateEnabled.value = true;
  if (val === "" && derivateEnabled.value) derivateEnabled.value = false;
});
watchEffect(() => {
  self.value.derivative = derivateReady.value;
});

const initSecant = self.value.secants;
const secantEnabled = ref(initSecant.length > 0);
const secantArr = reactive<
  {
    key: number;
    followMouse: boolean;
    x1: number | "";
    x2: number | "";
  }[]
>(
  initSecant.map((item) => ({
    key: Math.random(),
    followMouse: item.updateOnMouseMove,
    x1: item.x0,
    x2: item.x1 || "",
  }))
);
const secantReady = computed((): PrivateDataTypes.LinearPart.Secant[] => {
  if (!secantEnabled.value) return [];
  return secantArr.flatMap((item) => {
    if (item.x1 === "") return [];
    if (item.followMouse)
      return {
        x0: item.x1,
        updateOnMouseMove: true,
      };
    if (item.x2 === "") return [];
    return {
      x0: item.x1,
      x1: item.x2,
      updateOnMouseMove: false,
    };
  });
});
watchEffect(() => {
  self.value.secants = secantReady.value;
});
</script>

<style lang="scss">
.derivate-pane {
  width: 25em;
  s-tab {
    background-color: var(--s-color-surface-container-low);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    overflow: hidden;
  }
  .tab-text {
    display: flex;
    align-items: center;
  }
  .tab-badge {
    background-color: var(--s-color-success);
    color: var(--s-color-on-success);
    margin-left: 0.8em;
    &.error {
      background-color: var(--s-color-error);
    }
  }
  .badge {
    &-enter-active,
    &-leave-active {
      transition:
        opacity 0.1s,
        margin-left 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
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
  .x-coord.styled-inner {
    max-width: 12em;
  }
  .x-coord.styled-inner::part(input) {
    font-size: 20px;
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
