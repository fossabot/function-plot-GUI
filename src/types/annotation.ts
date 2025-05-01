import { FunctionPlotAnnotation } from "function-plot";

export type PrivateAnnotation = {
  /** @private */
  key: symbol;
  variable: "x" | "y";
  value: number;
  text: string;
};

export const toPublicAnnotation = ({
  variable,
  value,
  text,
}: PrivateAnnotation): FunctionPlotAnnotation => {
  const result: FunctionPlotAnnotation = {};
  if (text !== "") result.text = text;
  if (variable === "x") result.x = value;
  else result.y = value;
  return result;
};

export const toPrivateAnnotation = ({
  x,
  y,
  text,
}: FunctionPlotAnnotation): PrivateAnnotation => ({
  key: Symbol(),
  variable: x !== undefined ? "x" : "y",
  value: x ?? y ?? 0,
  text: text ?? "",
});
