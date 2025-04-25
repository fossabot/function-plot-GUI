
type NormalizeProp<T> =
  (T extends object ? true : false) extends false ? T : // 全原始类型
  T extends object ? NormalizeObj<T> : never // 含对象则归一为对象

type NormalizeObj<T extends object> = {
  [K in keyof T]-?: NormalizeProp<T[K]>
}

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
}

type TextField = {
  type: 'textfield';
  key: string;
  caption: string | Caption;
  textbox: TextBox;
};

type MultiTextField = {
  type: 'multiTextfield';
  key: string;
  array: (TextBox & { index: number } | Caption)[]
};

type SwitchField = {
  type: 'switch';
  key: string;
  caption: string | Caption;
}