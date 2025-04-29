<template>
  <s-scroll-view>
    <div id="options">
      <s-divider>{{ t("title.global") }}</s-divider>

      <div class="option">
        <span class="label">{{ t("inputs.grid") }}</span>
        <s-switch
          v-model.lazy="profile.options.grid"
          type="checkbox"
        ></s-switch>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.title") }}</span>
        <s-text-field
          :label="t('inputs.title')"
          v-model="profile.options.title"
        ></s-text-field>
      </div>

      <s-divider>{{ t("title.horizontalAxis") }}</s-divider>
      <div class="option">
        <span class="label">{{ t("inputs.reverse") }}</span>
        <s-switch
          v-model.lazy="profile.options.xAxis.invert"
          type="checkbox"
        ></s-switch>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.grow") }}</span>
        <s-segmented-button v-model.lazy="profile.options.xAxis.type">
          <s-segmented-button-item value="linear">{{
            t("inputs.linear")
          }}</s-segmented-button-item>
          <s-segmented-button-item value="log">
            {{ t("inputs.log") }}
          </s-segmented-button-item>
        </s-segmented-button>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field
          :label="t('inputs.caption')"
          v-model="profile.options.xAxis.label"
        ></s-text-field>
      </div>

      <s-divider>{{ t("title.verticalAxis") }}</s-divider>
      <div class="option">
        <span class="label">{{ t("inputs.reverse") }}</span>
        <s-switch
          v-model.lazy="profile.options.yAxis.invert"
          type="checkbox"
        ></s-switch>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.grow") }}</span>
        <s-segmented-button v-model.lazy="profile.options.yAxis.type">
          <s-segmented-button-item value="linear">{{
            t("inputs.linear")
          }}</s-segmented-button-item>
          <s-segmented-button-item value="log">
            {{ t("inputs.log") }}
          </s-segmented-button-item>
        </s-segmented-button>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field
          :label="t('inputs.caption')"
          v-model="profile.options.yAxis.label"
        ></s-text-field>
      </div>
    </div>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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

<style>
#options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 5px;
}
#options s-divider {
  font-size: 0.8em;
  margin: 5px 15px;
}
.option {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin: 0 30px;
}
.option span{
  line-height: 2em;
}
.option s-text-field {
  max-width: 100%;
}
</style>
