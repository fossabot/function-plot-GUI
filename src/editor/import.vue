<template>
  <s-dialog class="import-dialog">
    <s-tooltip class="data-import" slot="trigger">
      <s-fab slot="trigger">
        <SIconImport />
      </s-fab>
      {{ t("buttons.import") }}
    </s-tooltip>
    <div slot="headline" class="dialog-title">{{ t("title.source") }}</div>
    <s-text-field
      slot="text"
      label="JSON5 / JSON"
      multiLine
      v-model.lazy="importStr"
      class="monospace"
    ></s-text-field>
    <s-button slot="action" type="text">
      {{ t("buttons.cancel") }}
    </s-button>
    <s-button slot="action" type="text" @click="handleImport">
      {{ t("buttons.confirm") }}
    </s-button>
  </s-dialog>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import SIconImport from "@/ui/icons/import.vue";

import { useProfile } from "@/states";
const profile = useProfile();

import { ref } from "vue";
import JSON5 from "json5";
import type { FunctionPlotDatum } from "function-plot";
import { toInternalDatum } from "@/consts";

const importStr = ref("");
import { Snackbar } from "sober";
function handleImport() {
  if (importStr.value !== "") {
    try {
      const parsed = JSON5.parse(importStr.value);
      if (typeof parsed !== "object" || parsed === null) throw null;
      if (typeof parsed.data !== "object" || !Array.isArray(parsed.data))
        throw null;
      const newData = toInternalDatum(
        (JSON5.parse(importStr.value).data as FunctionPlotDatum[]) ?? []
      );
      profile.data = [];
      profile.data = newData;
      Snackbar.builder({
        text: t("title.importSuccess"),
        type: "success",
      });
    } catch (e) {
      Snackbar.builder({
        text: t("title.importFail"),
        type: "error",
      });
    }
    importStr.value = "";
  }
}
</script>

<style>
.dialog-title {
  user-select: none;
}
.import-dialog s-text-field {
  min-height: 180px;
  width: 40vw;
  max-width: 500px;
}
.inner-tip {
  font-size: 18px;
  font-family: var(--font-mono);
}
</style>
