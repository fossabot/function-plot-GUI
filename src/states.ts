import JSON5 from "json5";
import base64 from "base-64";
import utf8 from "utf8";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  getNewDatum,
  InternalAnnotation,
  InternalDatum,
  InternalGraphOptions,
  toInternalAnnotation,
  toInternalDatum,
  toInternalGraphOptions,
  toOriginalAnnotation,
  toOriginalDatum,
  toOriginalGraphOptions,
} from "./consts";
import { FunctionPlotOptions } from "function-plot";

// Datum define
export const useProfile = defineStore("profile", () => {
  const importedProfile = (() => {
    const rawCode = window?.location.search.match(/\?code=(.+)$/)?.[1];
    if (!rawCode) return null;
    try {
      const obj = JSON5.parse(
        utf8.decode(base64.decode(decodeURIComponent(rawCode)))
      );
      if (typeof obj === "object" && obj !== null)
        return obj as FunctionPlotOptions;
      else return null;
    } catch (e) {
      return null;
    }
  })();
  const data = ref<InternalDatum[]>(
    toInternalDatum(
      importedProfile?.data ?? [{ graphType: "polyline", fn: "x^2" }]
    )
  );
  const getOriginalData = (forExport?: boolean) =>
    toOriginalDatum(data.value, forExport);
  const addData = () => data.value.push(getNewDatum());

  const annotations = ref<InternalAnnotation[]>(
    toInternalAnnotation(importedProfile?.annotations ?? [])
  );
  const getOriginalAnnotaion = () => toOriginalAnnotation(annotations.value);
  const addAnnotation = () =>
    annotations.value.push({
      axis: "y",
      value: "0",
      text: "",
      key: Math.random(),
    });

  const options = ref<InternalGraphOptions>(
    toInternalGraphOptions(importedProfile ?? {})
  );
  const getOriginalOptions = () => toOriginalGraphOptions(options.value);

  return {
    data,
    getOriginalData,
    addData,
    annotations,
    getOriginalAnnotaion,
    addAnnotation,
    options,
    getOriginalOptions,
  };
});

// Theme define
export const useTheme = defineStore("theme", () => {
  const themeValues = ["auto", "dark", "light"] as const;
  const initialIndex = (() => {
    if (typeof localStorage !== "undefined") {
      const savedTheme = Number(localStorage.getItem("theme"));
      if ([0, 1, 2].includes(savedTheme)) return savedTheme as 0 | 1 | 2;
    }
    return 0;
  })();
  const index = ref(initialIndex);
  const initialValue = themeValues[initialIndex];
  const value = computed(() => themeValues[index.value]);
  const toogle = () => {
    index.value = ((index.value + 1) % themeValues.length) as 0 | 1 | 2;
    localStorage.setItem("theme", index.value.toString());
  };
  return { initialIndex, initialValue, index, value, toogle };
});
