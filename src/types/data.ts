import { FunctionPlotDatum } from "function-plot";
import { omitAttr, amendAttr } from "./utils";

namespace PrivateDataTypes {
  type Global = {
    /** @private */
    key: symbol;
    color: string;
  };
  type Function = Global & {
    skipTip: boolean;
    nSamples: number | undefined;
    closed: boolean;
  };
  /** Normal functions, y=f(x) */
  export type Linear = Function & {
    fnType: "linear";
    graphType: "interval" | "polyline" | "scatter";
    fn: string;
  };
  /** Implicit functions, F(x,y)=0 */
  export type Implicit = Function & {
    fnType: "implicit";
    graphType: "interval";
    fn: string;
  };
  /** Parametric functions, x=f(t), y=g(t) */
  export type Parametric = Function & {
    fnType: "parametric";
    graphType: "polyline" | "scatter";
    x: string;
    y: string;
  };
  /** Polar functions, r=f(t) */
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
  if (data.fnType === "text") {
    return omitAttr(
      {
        ...data,
        fnType: undefined,
      },
      {
        key: () => true,
        fnType: () => true,
        color: "",
      }
    );
  }
  return omitAttr(data, {
    key: () => true,
    fnType: "linear",
    graphType: "interval",
    skipTip: false,
    closed: false,
    color: "",
    nSamples: undefined,
  });
}

export function toPrivateData(data: Partial<PrivateData>) {
  const functionGlobals = {
    skipTip: false,
    closed: false,
    color: "",
    nSamples: undefined,
  };
  switch (data.fnType) {
    case "polar":
      return amendAttr<PrivateDataTypes.Polar>(data, {
        key: Symbol(),
        fnType: "polar",
        graphType: "polyline",
        r: "",
        ...functionGlobals,
      });
    case "parametric":
      return amendAttr<PrivateDataTypes.Parametric>(data, {
        key: Symbol(),
        fnType: "parametric",
        graphType: "polyline",
        x: "",
        y: "",
        ...functionGlobals,
      });
    case "points":
      return amendAttr<PrivateDataTypes.Points>(data, {
        key: Symbol(),
        fnType: "points",
        graphType: "polyline",
        points: () => [],
        closed: false,
        color: "",
      });
    case "vector":
      return amendAttr<PrivateDataTypes.Vector>(data, {
        key: Symbol(),
        fnType: "vector",
        graphType: "polyline",
        vector: () => [1, 0],
        offset: () => [0, 0],
        color: "",
      });
    case "linear":
    case "implicit":
      return amendAttr<PrivateDataTypes.Linear | PrivateDataTypes.Implicit>(
        data,
        {
          key: Symbol(),
          fnType: "linear",
          graphType: "interval",
          fn: "",
          ...functionGlobals,
        }
      );
    case undefined:
      if ("text" in data && typeof data.text === "string") {
        return amendAttr<PrivateDataTypes.Text>(data, {
          key: Symbol(),
          fnType: "text",
          graphType: "text",
          text: "",
          location: () => [0, 0],
          color: "",
        });
      } else
        return amendAttr<PrivateDataTypes.Linear>(
          data as Partial<PrivateDataTypes.Linear>,
          {
            key: Symbol(),
            fnType: "linear",
            graphType: "interval",
            fn: "",
            ...functionGlobals,
          }
        );
  }
}
