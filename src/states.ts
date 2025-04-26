import JSON5 from "json5";
import base64 from "base-64";
import utf8 from "utf8";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { InternalDatum, toInternalDatum, toOriginalDatum } from "./consts";
import { FunctionPlotDatum } from "function-plot";

// Datum define
export const useProfile = defineStore("profile", () => {
  const data = ref<InternalDatum[]>(
    (() => {
      const rawCode = window?.location.search.match(/\?code=(.+)$/)?.[1];
      if (rawCode)
        try {
          const code = utf8.decode(base64.decode(decodeURIComponent(rawCode)));
          const data = toInternalDatum(
            (JSON5.parse(code).data as FunctionPlotDatum[]) ?? []
          );
          return toInternalDatum(<FunctionPlotDatum[]>data);
        } catch (e) {}
    })() ?? [{ fnType: "linear", graphType: "polyline", fn: "x^2", key: 1 }]
  );
  const getOriginalCopy = (forExport?: boolean) =>
    toOriginalDatum(data.value, forExport);
  return { data, getOriginalCopy };
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
