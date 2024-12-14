import type { FunctionPlotDatum } from "function-plot";

export type ValueLabel = {
  value: string;
  label: string;
};

export const inputTypeArr = [
  "fn",
  "x",
  "y",
  "r",
  "vector",
  "offset",
  "range",
] as const;

export type InputType = {
  value: "fn" | "x" | "y" | "r";
  label: string;
  title: string;
  placeholder: string;
};

export type CoordType = {
  value: "vector" | "offset" | "range";
  label: string;
  sep: string;
  fin: string;
  placeholder1: string;
  placeholder2: string;
  optional?: boolean;
  defaultVal?: [number, number];
};

export type FnType = {
  value: FunctionPlotDatum["fnType"];
  label: string;
  inputs: InputType[];
  coord?: CoordType[];
  notAllowedInIntervel?: boolean;
};
export const getFnType = (fnType: string = "linear") =>
  <FnType>fnTypeArr.find(({ value }) => value === fnType);

export const graphTypeArr = [
  { value: "interval", label: "默认" },
  { value: "polyline", label: "多边形" },
  // { value: "text", label: "text" },
  { value: "scatter", label: "散点" },
] as const satisfies ValueLabel[];

export const fnTypeArr = [
  {
    value: "linear",
    label: "一般",
    inputs: [{ value: "fn", label: "函数", title: "y=", placeholder: "f(x)" }],
  },
  {
    value: "implicit",
    label: "隐函数",
    inputs: [
      { value: "fn", label: "函数", title: "0=", placeholder: "f(x,y)" },
    ],
  },
  {
    value: "parametric",
    label: "参数方程",
    inputs: [
      { value: "x", label: "x", title: "x=", placeholder: "f(t)" },
      { value: "y", label: "y", title: "y=", placeholder: "g(t)" },
    ],
    coord: [
      {
        value: "range",
        label: "t ∈ [",
        sep: ",",
        fin: "]",
        placeholder1: "0",
        placeholder2: "2π",
        optional: true,
        defaultVal: [0, 2 * Math.PI],
      },
    ],
    notAllowedInIntervel: true,
  },
  {
    value: "polar",
    label: "极坐标",
    inputs: [
      { value: "r", label: "半径", title: "r=", placeholder: "f(theta)" },
    ],
    coord: [
      {
        value: "range",
        label: "theta ∈ [",
        sep: ",",
        fin: "]",
        placeholder1: "-π",
        placeholder2: "π",
        optional: true,
        defaultVal: [-Math.PI, Math.PI],
      },
    ],
    notAllowedInIntervel: true,
  },
  // {
  //   value: "points",
  //   label: "点",
  //   inputs: [],
  //   notAllowedInIntervel: true,
  // },
  {
    value: "vector",
    label: "向量",
    inputs: [],
    coord: [
      {
        value: "vector",
        label: "向量大小 (",
        sep: ",",
        fin: ")",
        placeholder1: "x",
        placeholder2: "y",
      },
      {
        value: "offset",
        label: "起点坐标 (",
        sep: ",",
        fin: ")",
        placeholder1: "0",
        placeholder2: "0",
        optional: true,
      },
    ],
    notAllowedInIntervel: true,
  },
] as const satisfies FnType[];
