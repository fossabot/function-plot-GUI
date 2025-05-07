import { FunctionPlotDatum } from "function-plot";
import { omitAttr, amendAttr } from "./utils";
import cloneDeep from "lodash-es/cloneDeep";

export namespace PrivateDataTypes {
  type Global = {
    /** @private */
    key: number;
    color: string;
    hidden: boolean;
  };
  type Function = Global & {
    skipTip: boolean;
    nSamples: number | undefined;
    closed: boolean;
    range: [number, number];
  };

  export const allowedGraphTypes = {
    linear: ["interval", "polyline", "scatter"],
    implicit: ["interval"],
    parametric: ["polyline", "scatter"],
    polar: ["polyline", "scatter"],
    points: ["polyline", "scatter"],
    vector: ["polyline"],
    text: ["text"],
  } as const;

  /** Normal functions: y=f(x) */
  export type Linear = Function & {
    fnType: "linear";
    graphType: (typeof allowedGraphTypes)["linear"][number];
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
    graphType: (typeof allowedGraphTypes)["parametric"][number];
    x: string;
    y: string;
  };
  /** Polar functions: r=f(t) */
  export type Polar = Function & {
    fnType: "polar";
    graphType: (typeof allowedGraphTypes)["polar"][number];
    r: string;
  };
  /** Points */
  export type Points = Global & {
    fnType: "points";
    graphType: (typeof allowedGraphTypes)["points"][number];
    points: [number, number][];
    closed: boolean;
  };
  /** Vector */
  export type Vector = Global & {
    fnType: "vector";
    graphType: (typeof allowedGraphTypes)["vector"][number];
    vector: [number, number];
    offset: [number, number];
  };
  /** Text */
  export type Text = Global & {
    fnType: "text";
    graphType: (typeof allowedGraphTypes)["text"][number];
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

  export type Functions = Linear | Implicit | Parametric | Polar;

  export type Full = Linear &
    Implicit &
    Parametric &
    Polar &
    Points &
    Vector &
    Text;
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
        hidden: false,
        color: "",
      }
    );
  return omitAttr(
    cloneDeep({
      ...data,
      range: ((): [number, number] | undefined => {
        if (!("range" in data)) return undefined;
        let [v1, v2] = data.range;
        if (v1 === -Infinity && v2 === Infinity) return undefined;
        return data.range;
      })(),
    }),
    {
      key: () => true,
      fnType: "linear",
      graphType: "interval",
      skipTip: false,
      closed: false,
      hidden: false,
      color: "",
      nSamples: undefined,
      range: (range) => range === undefined,
    }
  );
}

export function toPrivateData(input: Object) {
  const data = input as Partial<PrivateData>;
  const getGlobals = () => ({
    key: Math.random(),
    color: "",
    hidden: false,
  });
  const getFunctionGlobals = () => ({
    ...getGlobals(),
    skipTip: false,
    closed: false,
    nSamples: undefined,
    range: () => [-Infinity, Infinity] as [number, number],
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
    case "text":
      return amendAttr<PrivateDataTypes.Text>(data, {
        fnType: "text",
        graphType: "text",
        text: "",
        location: () => [0, 0],
        ...getGlobals(),
      });
    default:
      throw new TypeError(
        `Unknown fnType "${(<any>data).fnType}" in toPrivateData function`
      );
  }
}
