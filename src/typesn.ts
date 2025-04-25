import { InternalDatum } from "./consts";

type Selector<_T, _U> = any;
type Loose<T, U> = T | U;
type Strict<T, _U> = T;

type GraphTypeObj = {
  value: string;
  label: string;
  isDefault?: boolean;
};

type GraphTypeMap = Map<string, GraphTypeObj>;

type TextBox<Selection extends Selector> = {
  type: Selection<"text" | "number">;
  placeholder: string;
  style?: "normal" | "math" | "monospace";
  size?: "normal" | "small" | "large";
};


type Caption = {
  text: string;
  style?: "normal" | "math" | "monospace";
  size?: "normal" | "small" | "large";
  color?: "normal" | "dimmed" | "highlighted";
}

type TextField = {
  key: string;
  caption: string | Caption;
};

function normalizeTextField(field: TextField) {
  function normalizeCaption(caption: Caption) {
    return {
      ...caption,
      style: caption.style ?? "normal",
      size: caption.size ?? "normal",
      color: caption.color ?? "normal",
    };
  }
  type StrictCaption = ReturnType<typeof normalizeCaption>;
  return {
    ...field,
    caption: normalizeCaption(
      typeof field.caption === "string"
        ? { text: field.caption }
        : field.caption
    ) as StrictCaption,
  };
}

type MultiTextField = {
  key: string;
};

type Field = {};

type FnTypeObj = {
  value: string;
  label: string;
  isDefault?: boolean;
  allowedGraphTypes: GraphTypeObj[];
  requiredFields: Field[];
  optionalFields: Field[];
  extraProcess?: (item: InternalDatum) => void;
};

type FnTypeMap = Map<string, FnTypeObj & { allowedGraphTypeMap: GraphTypeMap }>;
