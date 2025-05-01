import JSON5 from "json5";
import base64 from "base-64";
import utf8 from "utf8";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { FunctionPlotDatum, FunctionPlotOptions } from "function-plot";
import { toPrivateData, toPublicData } from "./types/data";
import { toPrivateAnnotation, toPublicAnnotation } from "./types/annotation";
import { toPrivateOptions, toPublicOptions } from "./types/options";

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
  const getInvisible: () => FunctionPlotDatum = () => ({
    graphType: "text",
    text: "",
    location: [0, 0],
  });

  const importedDatum = importedProfile?.data;
  const processedDatum = importedDatum
    ? importedDatum.map(toPrivateData)
    : [toPrivateData({ fn: "x^2" })];

  const datum = ref(processedDatum);

  const getPublicDatum = (forExport?: boolean) =>
    datum.value
      .filter(({ hidden }) => !(hidden && forExport))
      .map((data) => (data.hidden ? getInvisible() : toPublicData(data)));

  const addData = () => datum.value.push(toPrivateData({}));

  const importedAnnotations = importedProfile?.annotations;
  const processedAnnotations = importedAnnotations
    ? importedAnnotations.map(toPrivateAnnotation)
    : [];

  const annotations = ref(processedAnnotations);
  const getPublicAnnotations = () => annotations.value.map(toPublicAnnotation);
  const addAnnotation = () => annotations.value.push(toPrivateAnnotation({}));

  const options = ref(toPrivateOptions(importedProfile ?? {}));
  const getPublicOptions = () => toPublicOptions(options.value);

  return {
    datum,
    annotations,
    options,
    getPublicDatum,
    getPublicAnnotations,
    getPublicOptions,
    addData,
    addAnnotation,
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
