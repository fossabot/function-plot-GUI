export type ValueLabel = {
  value: string;
  label: string;
};

export type FnType = ValueLabel & {
  inputs: string[];
  coord?: ValueLabel[];
  notAllowedInIntervel?: boolean;
};

export const inputArr = [
  { value: "fn", label: "函数" },
  { value: "r", label: "半径" },
  { value: "x", label: "x" },
  { value: "y", label: "y" },
  { value: "text", label: "文本" },
] as const satisfies ValueLabel[];

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
    inputs: ["fn"],
  },
  {
    value: "implicit",
    label: "隐函数",
    inputs: ["fn"],
  },
  {
    value: "parametric",
    label: "参数方程",
    inputs: ["x", "y"],
    notAllowedInIntervel: true,
  },
  {
    value: "polar",
    label: "极坐标",
    inputs: ["r"],
		notAllowedInIntervel: true,
  },
  {
    value: "points",
    label: "点",
    inputs: ["x", "y"],
		notAllowedInIntervel: true,
  },
  {
    value: "vector",
    label: "向量",
    inputs: [],
    coord: [
      { value: "vector", label: "向量大小" },
      { value: "offset", label: "起点" },
    ],
  },
] as const satisfies FnType[];
