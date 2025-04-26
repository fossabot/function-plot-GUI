<template>
  <s-dialog>
    <s-tooltip class="data-import" slot="trigger">
      <s-fab slot="trigger">
        <SIconImport />
      </s-fab>
      {{ t("buttons.import") }}
    </s-tooltip>
    <div slot="headline">{{ t("title.source") }}</div>
    <s-text-field
      slot="text"
      label="JSON5 / JSON"
      multiLine
      style="min-height: 180px; min-width: 40vw"
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

import { useProfile } from "@/consts";
const profile = useProfile();

import { onMounted, ref } from "vue";
import JSON5 from "json5";
import base64 from "base-64";
import utf8 from "utf8";
import type { FunctionPlotDatum } from "function-plot";
import { toInternalDatum } from "@/consts";
onMounted(() => {
  const rawCode = window.location.search.match(/\?code=(.+)$/)?.[1];
  if (rawCode)
    try {
      const code = utf8.decode(base64.decode(decodeURIComponent(rawCode)));
      const data = toInternalDatum(
        (JSON5.parse(code).data as FunctionPlotDatum[]) ?? []
      );
      profile.data = toInternalDatum(<FunctionPlotDatum[]>data);
      console.log(code);
      console.log(data);
    } catch (e) {}
});

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
