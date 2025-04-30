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

export function toPrivateOptions(
  original: Partial<FunctionPlotOptions>
): PrivateOptions {
  const defaultAxis = {
    invert: false,
    label: "",
    type: "linear",
  } as PrivateAxis;
  const { xAxis, yAxis } = original;
  return amendAttr<PrivateOptions>(original, {
    xAxis: () => amendAttr<PrivateAxis>(xAxis ?? {}, defaultAxis),
    yAxis: () => amendAttr<PrivateAxis>(yAxis ?? {}, defaultAxis),
    title: "",
    grid: false,
  });
}

const checkAxisUseless = ({ invert, label, type }: PrivateAxis) =>
  label === "" && !invert && type === "linear";

export const toPublicOptions = (
  options: PrivateOptions
): Partial<FunctionPlotOptions> =>
  omitAttr(options, {
    title: "",
    grid: false,
    xAxis: checkAxisUseless,
    yAxis: checkAxisUseless,
  });
