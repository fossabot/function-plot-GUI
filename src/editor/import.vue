<template>
  <s-dialog class="import-dialog">
    <s-tooltip class="data-import" slot="trigger">
      <s-fab slot="trigger">
        <SIconImport />
      </s-fab>
      {{ t("editor.import") }}
    </s-tooltip>
    <div slot="headline" class="dialog-title">
      {{ t("editor.importRelated.title") }}
    </div>
    <s-text-field
      slot="text"
      :label="t('editor.importRelated.placeholder')"
      multiLine
      v-model.lazy="importStr"
      class="monospace"
    ></s-text-field>
    <s-button slot="action" type="text">
      {{ t("editor.importRelated.cancel") }}
    </s-button>
    <s-button slot="action" type="text" @click="handleImport">
      {{ t("editor.importRelated.confirm") }}
    </s-button>
  </s-dialog>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { I18nSchema } from "@/i18n";
const { t } = useI18n<{ message: I18nSchema }>();

import SIconImport from "@/ui/icons/import.vue";

import { useProfile } from "@/states";
const profile = useProfile();

import { ref } from "vue";
import JSON5 from "json5";

const importStr = ref("");
import { Snackbar } from "sober";
import { toPrivateData } from "@/types/data";
import { FunctionPlotOptions } from "function-plot";
import { toPrivateAnnotation } from "@/types/annotation";
import { toPrivateOptions } from "@/types/options";
import emitter from "@/mitt";
function handleImport() {
  if (importStr.value !== "") {
    try {
      const parsed = JSON5.parse(importStr.value) as FunctionPlotOptions;
      if (typeof parsed !== "object" || parsed === null) throw null;
      if (typeof parsed.data !== "object" || !Array.isArray(parsed.data))
        throw null;
      const newData = (parsed.data ?? []).map(toPrivateData);
      profile.datum = newData;
      const newAnnotations = (parsed.annotations ?? []).map(
        toPrivateAnnotation
      );
      profile.annotations = newAnnotations;
      const newOptions = toPrivateOptions(parsed);
      profile.options = newOptions;
      emitter.emit("require-full-update", "Data import");
      Snackbar.builder({
        text: t("editor.importRelated.success"),
        type: "success",
      });
    } catch (e) {
      Snackbar.builder({
        text: t("editor.importRelated.fail"),
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
</style>
