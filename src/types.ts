import { InternalDatum } from "./consts";

type NormalizeProp<T> = (T extends object ? true : false) extends false
  ? T // 全原始类型
  : T extends object
    ? NormalizeObj<T>
    : never; // 含对象则归一为对象

type NormalizeObj<T extends object> = {
  [K in keyof T]-?: NormalizeProp<T[K]>;
};

namespace FieldType {
  type TextBox = {
    type?: "text" | "number";
    placeholder: string;
    style?: "normal" | "math" | "monospace";
    size?: "normal" | "small" | "large";
  };

  type Caption = {
    text: string;
    style?: "normal" | "math" | "monospace";
    size?: "normal" | "small" | "large";
    color?: "normal" | "dimmed" | "highlighted";
  };

  export type Text = {
    type: "textfield";
    key: string;
    caption: string | Caption;
    textbox: TextBox;
  };

  export type MultiText = {
    type: "multiTextfield";
    key: string;
    array: ((TextBox & { index: number }) | Caption)[];
  };

  export type Switch = {
    type: "switchfield";
    key: string;
    caption: string | Caption;
  };

  export type MultiLine = {
    type: "multilinefield";
    key: string;
    array: ((TextBox & { index: number }) | Caption)[];
  };
}

type Field =
  | FieldType.Text
  | FieldType.MultiText
  | FieldType.Switch
  | FieldType.MultiLine;

type GraphTypeObj = {
  value: string;
  label: string;
  isDefault?: boolean;
};

type GraphTypeMap = Map<string, GraphTypeObj>;

type FnTypeObj = {
  value: string;
  label: string;
  isDefault?: boolean;
  allowedGraphTypes: GraphTypeObj[];
  requiredFields: Field[];
  optionalFields?: Field[];
  extraProcess?: (item: InternalDatum) => void;
};

type StrictFnTypeObj = NormalizeObj<FnTypeObj> & {
  allowedGraphTypeMap: GraphTypeMap;
};

type FnTypeMap = Map<string, StrictFnTypeObj>;

const fnTypeObj: FnTypeObj[] = [
  {
    isDefault: true,
    value: "linear",
    label: "fnType.linear",
    allowedGraphTypes: [
      { value: "polyline", label: "graphType.polyline" },
      { value: "interval", label: "graphType.interval", isDefault: true },
      { value: "scatter", label: "graphType.scatter" },
    ],
    requiredFields: [
      {
        type: "textfield",
        key: "fn",
        caption: {
          text: "y=",
          style: "math",
        },
        textbox: {
          placeholder: "f(x)",
          style: "math",
        },
      },
    ],
    optionalFields: [
      {
        type: "multiTextfield",
        key: "range",
        array: [
          {
            text: "x ∈ [",
            style: "math",
          },
          {
            type: "number",
            placeholder: "min(x)",
            style: "math",
            index: 0,
          },
          {
            text: ",",
            style: "math",
          },
          {
            type: "number",
            placeholder: "max(x)",
            style: "math",
            index: 0,
          },
          {
            text: "]",
            style: "math",
          },
        ],
      },
    ],
  },
];
