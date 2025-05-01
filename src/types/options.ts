import { FunctionPlotOptions } from "function-plot";
import { amendAttr, omitAttr } from "./utils";
import cloneDeep from "lodash-es/cloneDeep";

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

const checkAxisUseless = ({ invert, label, type }: PrivateAxis) =>
  label === "" && !invert && type === "linear";

export const toPublicOptions = (
  options: PrivateOptions
): Partial<FunctionPlotOptions> =>
  omitAttr(cloneDeep(options), {
    title: "",
    grid: false,
    xAxis: checkAxisUseless,
    yAxis: checkAxisUseless,
  });
