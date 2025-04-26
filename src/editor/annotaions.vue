<template>
  <s-scroll-view>
    <div class="plot-data add-data">
      <s-icon name="add" />
      {{ t("buttons.add") }}
      <s-ripple attached></s-ripple>
    </div>
    <s-empty>{{ t("title.inDev") }}</s-empty>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
