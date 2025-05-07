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
};

const defaultAxis = {
  invert: false,
  label: "",
  type: "linear",
} as PrivateAxis;

export function toPrivateOptions(
  original: Partial<FunctionPlotOptions>
): PrivateOptions {
  const { xAxis, yAxis, title, grid } = original;
  return amendAttr<PrivateOptions>(
    { xAxis, yAxis, title, grid },
    {
      xAxis: () => amendAttr<PrivateAxis>(xAxis ?? {}, defaultAxis),
      yAxis: () => amendAttr<PrivateAxis>(yAxis ?? {}, defaultAxis),
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
    },
    {
      title: "",
      grid: false,
      xAxis: checkObjEmpty,
      yAxis: checkObjEmpty,
    }
  );
