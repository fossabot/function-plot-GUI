import { FunctionPlotOptions } from "function-plot";
import { amendAttr, omitAttr } from "./utils";

type PrivateAxis = {
  invert: boolean;
  label: string;
  type: "linear" | "log";
};

export type PrivateOptions = {
  xAxis: PrivateAxis;
  yAxis: PrivateAxis;
  grid: boolean;
  title: string;
  tip: {
    xLine: boolean;
    yLine: boolean;
  };
};

const defaultAxis = {
  invert: false,
  label: "",
  type: "linear",
} as PrivateAxis;

export function toPrivateOptions(
  original: Partial<FunctionPlotOptions>
): PrivateOptions {
  const { xAxis, yAxis, title, grid, tip = {} } = original;
  return amendAttr<PrivateOptions>(
    { xAxis, yAxis, title, grid },
    {
      xAxis: () => amendAttr<PrivateAxis>(xAxis ?? {}, defaultAxis),
      yAxis: () => amendAttr<PrivateAxis>(yAxis ?? {}, defaultAxis),
      tip: () => ({
        xLine: tip?.xLine ?? false,
        yLine: tip?.yLine ?? false,
      }),
      title: "",
      grid: false,
    }
  );
}

const checkObjEmpty = (object: Object) => Object.keys(object).length === 0;

export const toPublicOptions = (
  options: PrivateOptions
): Partial<FunctionPlotOptions> =>
  omitAttr(
    {
      ...options,
      xAxis: omitAttr(options.xAxis, defaultAxis),
      yAxis: omitAttr(options.yAxis, defaultAxis),
      tip: omitAttr(options.tip, { xLine: false, yLine: false }),
    },
    {
      title: "",
      grid: false,
      xAxis: checkObjEmpty,
      yAxis: checkObjEmpty,
      tip: checkObjEmpty,
    }
  );
