import type { FunctionPlotDatum } from "function-plot";
import { cloneDeep } from "lodash-es";

export type ValueLabel = { value: string; label: string; default?: boolean };

/** 字段列表 */
export const inputTypeArr = [
  "fn",
  "x",
  "y",
  "r",
  "vector",
  "offset",
  "range",
  "closed",
  "text",
  "location",
  "points",
] as const;

/** 文本字段类型 */
export type InputType = {
  value: "fn" | "x" | "y" | "r" | "text";
  label: string;
  title: string;
  placeholder: string;
  optional?: boolean;
};

/** 有序数对字段类型 */
export type CoordType = {
  value: "vector" | "offset" | "range" | "location";
  label: string;
  sep: string;
  fin: string;
  placeholder: [string, string];
  optional?: boolean;
  defaultVal?: [number, number];
  folded?: boolean;
};

/** 开关字段类型 */
export type SwitchType = { value: "closed"; label: string; folded?: boolean };

export type CoordArr = {
  value: "points";
  label: string;
  sep: string;
  fin: string;
  placeholder: [string, string];
};

export type OptInput = {
  label: string;
  placeholder?: string;
  vif?: keyof FunctionPlotDatum;
} & ({ value: "color"; type: "text" } | { value: "nSamples"; type: "number" });

export type FnType = {
  value: FunctionPlotDatum["fnType"] | "text";
  label: string;
  inputs: InputType[];
  coord?: CoordType[];
  coordArr?: CoordArr;
  switches?: SwitchType[];
  optInput?: OptInput[];
  allowedGraphType?: ValueLabel[];
  default?: boolean;
};

export type InternalDatum = Omit<FunctionPlotDatum, "fnType" | "graphType"> & {
  fnType: "text" | FunctionPlotDatum["fnType"];
  graphType: FunctionPlotDatum["graphType"];
  key: number;
};

export function toOriginalDatum(items: InternalDatum[]) {
  const cloned = cloneDeep(items);
  cloned.forEach((item) => {
    const fnType = item.fnType;
    const graphType = item.graphType;
    const graphTypeObj = getAllowedGraphType(fnType).find(
      (item) => item.value === graphType
    )!;
    if (getFnType(fnType).default) {
      delete (<any>item).fnType;
    }
    if ("default" in graphTypeObj && graphTypeObj.default) {
      delete (<any>item).graphType;
    }
  });
  return cloned as FunctionPlotDatum[];
}
export function toInternalDatum(items: FunctionPlotDatum[]) {
  const cloned = cloneDeep(items) as InternalDatum[];
  cloned.forEach((item, index) => {
    const clonedItem = cloned[index];
    if (item.graphType === "text") {
      clonedItem.fnType = "text";
    }
    if (item.fnType === undefined) {
      clonedItem.fnType = "linear";
    }
    if (item.graphType === undefined) {
      clonedItem.graphType = "interval";
    }
    clonedItem.key = Math.random();
  });
  return cloned;
}

export type InputProps = {
  dataItem: InternalDatum;
  fnType: FnType;
  blockFolded: boolean;
};

export const getFnType = (fnType: string = "linear") =>
  <FnType>fnTypeArr.find(({ value }) => value === fnType);

/** graphType 字段选项 */
export const getAllowedGraphType = (fnType?: string) =>
  fnType
    ? (fnTypeArr.find(({ value }) => value === fnType)?.allowedGraphType ?? [])
    : [];

export const fnTypeArr = [
  {
    default: true,
    value: "linear",
    label: "一般",
    allowedGraphType: [
      { value: "polyline", label: "多段线" },
      { value: "interval", label: "默认", default: true },
      { value: "scatter", label: "散点" },
    ],
    inputs: [{ value: "fn", label: "函数", title: "y=", placeholder: "f(x)" }],
    coord: [
      {
        value: "range",
        label: "x ∈ [",
        sep: ",",
        fin: "]",
        placeholder: ["-Inf", "+Inf"],
        optional: true,
        defaultVal: [-Infinity, Infinity],
        folded: true,
      },
    ],
    switches: [{ value: "closed", label: "闭合并填充", folded: true }],
    optInput: [
      {
        value: "color",
        type: "text",
        label: "颜色",
        placeholder: "RGB / HEX / 颜色名称",
      },
      {
        value: "nSamples",
        type: "number",
        label: "采样数",
        placeholder: "默认值为宽度",
      },
    ],
  },
  {
    value: "implicit",
    label: "隐函数",
    allowedGraphType: [{ value: "interval", label: "默认", default: true }],
    inputs: [
      { value: "fn", label: "函数", title: "0=", placeholder: "f(x,y)" },
    ],
    switches: [{ value: "closed", label: "闭合并填充", folded: true }],
    optInput: [
      {
        value: "color",
        type: "text",
        label: "颜色",
        placeholder: "RGB / HEX / 颜色名称",
      },
      {
        value: "nSamples",
        type: "number",
        label: "采样数",
        placeholder: "默认值为宽度",
      },
    ],
  },
  {
    value: "parametric",
    label: "参数方程",
    allowedGraphType: [
      { value: "polyline", label: "多段线" },
      { value: "scatter", label: "散点" },
    ],
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
        placeholder: ["0", "2π"],
        optional: true,
        defaultVal: [0, 2 * Math.PI],
      },
    ],
    switches: [{ value: "closed", label: "闭合并填充", folded: true }],
    optInput: [
      {
        value: "color",
        type: "text",
        label: "颜色",
        placeholder: "RGB / HEX / 颜色名称",
      },
      {
        value: "nSamples",
        type: "number",
        label: "采样数",
        placeholder: "默认值为宽度",
      },
    ],
  },
  {
    value: "polar",
    label: "极坐标",
    allowedGraphType: [
      { value: "polyline", label: "多段线" },
      { value: "scatter", label: "散点" },
    ],
    inputs: [
      { value: "r", label: "半径", title: "r=", placeholder: "f(theta)" },
    ],
    coord: [
      {
        value: "range",
        label: "theta ∈ [",
        sep: ",",
        fin: "]",
        placeholder: ["-π", "π"],
        optional: true,
        defaultVal: [-Math.PI, Math.PI],
      },
    ],
    switches: [{ value: "closed", label: "闭合并填充", folded: true }],
    optInput: [
      {
        value: "color",
        type: "text",
        label: "颜色",
        placeholder: "RGB / HEX / 颜色名称",
      },
      {
        value: "nSamples",
        type: "number",
        label: "采样数",
        placeholder: "默认值为宽度",
      },
    ],
  },
  {
    value: "points",
    label: "点集",
    allowedGraphType: [
      { value: "polyline", label: "多段线" },
      { value: "scatter", label: "散点" },
    ],
    inputs: [],
    coordArr: {
      value: "points",
      label: "(",
      sep: ",",
      fin: ")",
      placeholder: ["x", "y"],
    },
    switches: [{ value: "closed", label: "闭合并填充", folded: true }],
    optInput: [
      {
        value: "color",
        type: "text",
        label: "颜色",
        placeholder: "RGB / HEX / 颜色名称",
      },
    ],
  },
  {
    value: "vector",
    label: "向量",
    allowedGraphType: [
      { value: "polyline", label: "多段线" },
      { value: "scatter", label: "散点" },
    ],
    inputs: [],
    coord: [
      {
        value: "vector",
        label: "向量大小 (",
        sep: ",",
        fin: ")",
        placeholder: ["x", "y"],
      },
      {
        value: "offset",
        label: "起点坐标 (",
        sep: ",",
        fin: ")",
        placeholder: ["0", "0"],
        optional: true,
      },
    ],
    optInput: [
      {
        value: "color",
        type: "text",
        label: "颜色",
        placeholder: "RGB / HEX / 颜色名称",
      },
    ],
  },
  {
    value: "text",
    label: "文本",
    allowedGraphType: [{ value: "text", label: "文本" }],
    inputs: [
      {
        value: "text",
        title: "s=",
        label: "文本",
        placeholder: "Lorem ipsum dolor",
      },
    ],
    coord: [
      {
        value: "location",
        label: "位置 (",
        sep: ",",
        fin: ")",
        placeholder: ["x", "y"],
        defaultVal: [0, 0],
      },
    ],
    optInput: [
      {
        value: "color",
        type: "text",
        label: "颜色",
        placeholder: "RGB / HEX / 颜色名称",
      },
    ],
  },
] as const satisfies FnType[];

export function findError(graphData: FunctionPlotDatum[]) {
  for (const [index, dataItem] of graphData.entries()) {
    const fnType = getFnType(dataItem.fnType);
    for (const input of fnType.inputs) if (!dataItem[input.value]) return index;
    for (const coord of fnType.coord ?? [])
      if (!dataItem[coord.value] && !coord.optional) return index;
  }
  return 0;
}
