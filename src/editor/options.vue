<template>
  <s-scroll-view>
    <div id="options">
      <s-divider>{{ t("title.global") }}</s-divider>

      <div class="option">
        <span class="label">{{ t("inputs.grid") }}</span>
        <s-switch></s-switch>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field :label="t('inputs.caption')"></s-text-field>
      </div>

      <s-divider>{{ t("title.horizontalAxis") }}</s-divider>
      <div class="option">
        <span class="label">{{ t("inputs.grow") }}</span>
        <s-picker :label="t('inputs.grow')" :key="locale">
          <s-picker-item value="linear" selected>{{
            t("inputs.linear")
          }}</s-picker-item>
          <s-picker-item value="log">{{ t("inputs.log") }}</s-picker-item>
        </s-picker>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field :label="t('inputs.caption')"></s-text-field>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.range") }}</span>
        <s-text-field :label="t('inputs.caption')"></s-text-field>
      </div>

      <s-divider>{{ t("title.verticalAxis") }}</s-divider>
      <div class="option">
        <span class="label">{{ t("inputs.grow") }}</span>
        <s-picker :label="t('inputs.grow')" :key="locale">
          <s-picker-item value="linear" selected>{{
            t("inputs.linear")
          }}</s-picker-item>
          <s-picker-item value="log">{{ t("inputs.log") }}</s-picker-item>
        </s-picker>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.caption") }}</span>
        <s-text-field :label="t('inputs.caption')"></s-text-field>
      </div>
      <div class="option">
        <span class="label">{{ t("inputs.range") }}</span>
        <s-text-field :label="t('inputs.caption')"></s-text-field>
      </div>
    </div>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
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
