
type NormalizeProp<T> =
  (T extends object ? true : false) extends false ? T : // 全原始类型
  T extends object ? NormalizeObj<T> : never // 含对象则归一为对象

type NormalizeObj<T extends object> = {
  [K in keyof T]-?: NormalizeProp<T[K]>
}

