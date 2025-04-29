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
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field
          :label="t('inputs.caption')"
          v-model="profile.options.title"
        ></s-text-field>
      </div>

      <s-divider>{{ t("title.horizontalAxis") }}</s-divider>
      <div class="option">
        <span class="label">{{ t("inputs.reverse") }}</span>
        <s-switch></s-switch>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.grow") }}</span>
        <s-segmented-button>
          <s-segmented-button-item value="y">{{
            t("inputs.linear")
          }}</s-segmented-button-item>
          <s-segmented-button-item value="x">
            {{ t("inputs.log") }}
          </s-segmented-button-item>
        </s-segmented-button>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field :label="t('inputs.caption')"></s-text-field>
      </div>

      <s-divider>{{ t("title.verticalAxis") }}</s-divider>
      <div class="option">
        <span class="label">{{ t("inputs.reverse") }}</span>
        <s-switch></s-switch>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.grow") }}</span>
        <s-segmented-button>
          <s-segmented-button-item value="y">{{
            t("inputs.linear")
          }}</s-segmented-button-item>
          <s-segmented-button-item value="x">
            {{ t("inputs.log") }}
          </s-segmented-button-item>
        </s-segmented-button>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field :label="t('inputs.caption')"></s-text-field>
      </div>
    </div>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useProfile } from "@/states";
const profile = useProfile();
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
  align-items: center;
  justify-content: space-between;
  margin: 0 30px;
}
</style>
