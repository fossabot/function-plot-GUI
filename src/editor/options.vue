<template>
  <s-scroll-view>
    <s-empty>{{ t('title.inDev') }}</s-empty>
  </s-scroll-view>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
