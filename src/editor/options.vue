<template>
  <s-scroll-view>
    <div id="options">
      <!-- global -->
      <s-divider class="options-divider">{{ t("options.global") }}</s-divider>
      <div class="fields">
        <span class="label">{{ t("options.grid") }}</span>
        <s-switch
          v-model.lazy="profile.options.grid"
          type="checkbox"
          class="input"
        ></s-switch>

        <span class="label">悬浮十字线</span>
        <div class="input checkboxes">
          <s-checkbox v-model.lazy="profile.options.tip.yLine" type="checkbox">
            横线
          </s-checkbox>
          <s-checkbox v-model.lazy="profile.options.tip.xLine" type="checkbox">
            竖线
          </s-checkbox>
        </div>

        <span class="label">{{ t("options.title") }}</span>
        <s-text-field
          :label="t('options.title')"
          v-model="profile.options.title"
          class="input"
        ></s-text-field>
      </div>

      <!-- xAxis -->
      <s-divider class="options-divider">{{
        t("options.horizontal")
      }}</s-divider>
      <div class="fields">
        <span class="label">{{ t("options.axis.reverse") }}</span>
        <s-switch
          v-model.lazy="profile.options.xAxis.invert"
          type="checkbox"
          class="input"
        ></s-switch>

        <span class="label">{{ t("options.axis.grow") }}</span>
        <s-segmented-button
          v-model.lazy="profile.options.xAxis.type"
          class="input"
        >
          <s-segmented-button-item value="linear">{{
            t("options.axis.linear")
          }}</s-segmented-button-item>
          <s-segmented-button-item value="log">
            {{ t("options.axis.log") }}
          </s-segmented-button-item>
        </s-segmented-button>

        <span class="label">{{ t("options.axis.caption") }}</span>
        <s-text-field
          :label="t('options.axis.caption')"
          class="input"
          v-model="profile.options.xAxis.label"
        ></s-text-field>
      </div>

      <!-- yAxis -->
      <s-divider class="options-divider">{{ t("options.vertical") }}</s-divider>
      <div class="fields">
        <span class="label">{{ t("options.axis.reverse") }}</span>
        <s-switch
          v-model.lazy="profile.options.yAxis.invert"
          type="checkbox"
          class="input"
        ></s-switch>

        <span class="label">{{ t("options.axis.grow") }}</span>
        <s-segmented-button
          v-model.lazy="profile.options.yAxis.type"
          class="input"
        >
          <s-segmented-button-item value="linear">{{
            t("options.axis.linear")
          }}</s-segmented-button-item>
          <s-segmented-button-item value="log">
            {{ t("options.axis.log") }}
          </s-segmented-button-item>
        </s-segmented-button>

        <span class="label">{{ t("options.axis.caption") }}</span>
        <s-text-field
          :label="t('options.axis.caption')"
          v-model="profile.options.yAxis.label"
          class="input"
        ></s-text-field>
      </div>
    </div>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

import { useProfile } from "@/states";
const profile = useProfile();

import { watch } from "vue";
import emitter from "@/mitt";
watch(
  [
    () => profile.options.xAxis.type,
    () => profile.options.yAxis.type,
    () => profile.options.xAxis.invert,
    () => profile.options.yAxis.invert,
  ],
  () => {
    emitter.emit("require-full-update", "axis type change");
  }
);
</script>

<style lang="scss">
#options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 5px;
  font-size: 16px;

  .options-divider {
    font-size: 0.8em;
    margin: 5px 15px;
  }

  .fields {
    display: grid;
    grid-template-columns: max-content minmax(auto, 16em);
    justify-content: space-between;
    align-items: center;
    row-gap: 0.5em;
    column-gap: 1.5em;
    margin: 0 30px;

    .label {
      justify-self: start;
      display: flex;
    }
    .input {
      justify-self: end;
    }
    .checkboxes {
      display: flex;
      gap: 1em;
    }
    s-text-field.input {
      width: 100%;
    }
  }
}
.option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin: 0 30px;
  span {
    line-height: 2em;
  }
  s-text-field {
    max-width: 100%;
  }
}
</style>
