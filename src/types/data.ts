import { FunctionPlotDatum } from "function-plot";
import { omitAttr, amendAttr } from "./utils";
import cloneDeep from "lodash-es/cloneDeep";

namespace PrivateDataTypes {
  type Global = {
    /** @private */
    key: symbol;
    color: string;
    hidden: boolean;
  };
  type Function = Global & {
    skipTip: boolean;
    nSamples: number | undefined;
    closed: boolean;
  };
  /** Normal functions: y=f(x) */
  export type Linear = Function & {
    fnType: "linear";
    graphType: "interval" | "polyline" | "scatter";
    fn: string;
  };
  /** Implicit functions: F(x,y)=0 */
  export type Implicit = Function & {
    fnType: "implicit";
    graphType: "interval";
    fn: string;
  };
  /** Parametric functions: x=f(t), y=g(t) */
  export type Parametric = Function & {
    fnType: "parametric";
    graphType: "polyline" | "scatter";
    x: string;
    y: string;
  };
  /** Polar functions: r=f(t) */
  export type Polar = Function & {
    fnType: "polar";
    graphType: "polyline" | "scatter";
    r: string;
  };
  /** Points */
  export type Points = Global & {
    fnType: "points";
    graphType: "polyline" | "scatter";
    points: [number, number][];
    closed: boolean;
  };
  /** Vector */
  export type Vector = Global & {
    fnType: "vector";
    graphType: "polyline";
    vector: [number, number];
    offset: [number, number];
  };
  /** Text */
  export type Text = Global & {
    fnType: "text";
    graphType: "text";
    text: string;
    location: [number, number];
  };

  export type Combined =
    | Linear
    | Implicit
    | Parametric
    | Polar
    | Points
    | Vector
    | Text;
}
export type PrivateData = PrivateDataTypes.Combined;

export function toPublicData(data: PrivateData): FunctionPlotDatum {
  if (data.fnType === "text")
    return omitAttr(
      {
        ...cloneDeep(data),
        fnType: undefined,
      },
      {
        key: () => true,
        fnType: () => true,
        color: "",
      }
    );
  return omitAttr(cloneDeep(data), {
    key: () => true,
    fnType: "linear",
    graphType: "interval",
    skipTip: false,
    closed: false,
    color: "",
    nSamples: undefined,
  });
}

export function toPrivateData(input: FunctionPlotDatum) {
  const data = input as Partial<PrivateData>;
  const getGlobals = () => ({
    key: Symbol(),
    color: "",
    hidden: false,
  });
  const getFunctionGlobals = () => ({
    ...getGlobals(),
    skipTip: false,
    closed: false,
    nSamples: undefined,
  });
  switch (data.fnType) {
    case "linear":
    case "implicit":
      return amendAttr<PrivateDataTypes.Linear | PrivateDataTypes.Implicit>(
        data,
        {
          fnType: "linear",
          graphType: "interval",
          fn: "",
          ...getFunctionGlobals(),
        }
      );
    case "polar":
      return amendAttr<PrivateDataTypes.Polar>(data, {
        fnType: "polar",
        graphType: "polyline",
        r: "",
        ...getFunctionGlobals(),
      });
    case "parametric":
      return amendAttr<PrivateDataTypes.Parametric>(data, {
        fnType: "parametric",
        graphType: "polyline",
        x: "",
        y: "",
        ...getFunctionGlobals(),
      });
    case "points":
      return amendAttr<PrivateDataTypes.Points>(data, {
        fnType: "points",
        graphType: "polyline",
        points: () => [],
        closed: false,
        ...getGlobals(),
      });
    case "vector":
      return amendAttr<PrivateDataTypes.Vector>(data, {
        fnType: "vector",
        graphType: "polyline",
        vector: () => [1, 1],
        offset: () => [0, 0],
        ...getGlobals(),
      });
    case undefined:
      if ("text" in data && typeof data.text === "string") {
        return amendAttr<PrivateDataTypes.Text>(data, {
          fnType: "text",
          graphType: "text",
          text: "",
          location: () => [0, 0],
          ...getGlobals(),
        });
      } else
        return amendAttr<PrivateDataTypes.Linear>(
          data as Partial<PrivateDataTypes.Linear>,
          {
            fnType: "linear",
            graphType: "interval",
            fn: "",
            ...getFunctionGlobals(),
          }
        );
    default:
      throw new TypeError(
        `Unknown fnType "${data.fnType}" in toPrivateData function`
      );
  }
}
