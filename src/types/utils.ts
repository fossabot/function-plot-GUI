type SimpleType = string | number | boolean | symbol | null | undefined;
type OmitAttrMap<T extends object> = {
  [K in keyof T]?: T[K] extends SimpleType
    ? T[K] | ((value: T[K], obj: T) => boolean)
    : (value: T[K], obj: T) => boolean;
};

export function omitAttr<T extends Object>(
  obj: T,
  map: OmitAttrMap<T>
): Partial<T> {
  const result: Partial<T> = { ...obj };
  const isComplex = (value: any) =>
    typeof value === "function" ||
    (typeof value === "object" && value !== null);
  for (const key in map) {
    if (!obj.hasOwnProperty(key)) continue;
    if (typeof map[key] === "function") {
      if (map[key](obj[key], obj)) delete result[key];
      continue;
    }
    if (isComplex(obj[key]))
      throw new TypeError(`map[${key}] is not a function`);
    if (obj[key] === map[key]) delete result[key];
  }
  return result;
}

type AmendAttrMap<T extends Object> = {
  [K in keyof T]: T[K] extends SimpleType
    ? T[K] | ((obj: Partial<T>) => T[K])
    : (obj: Partial<T>) => T[K];
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export function amendAttr<T extends Object>(
  input: DeepPartial<T>,
  map: AmendAttrMap<T>
): T {
  const obj = input as Partial<T>;
  const result = { ...obj };
  for (const key in map) {
    if (key in obj && obj[key] !== undefined) continue;
    if (typeof map[key] === "function") result[key] = map[key](obj);
    else result[key] = map[key] as T[typeof key];
  }
  return result as T;
}
