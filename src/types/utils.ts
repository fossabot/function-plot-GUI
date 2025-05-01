type SimpleType = string | number | boolean | symbol | null | undefined;
type OmitAttrMap<T extends object> = {
  [K in keyof T]?: T[K] extends SimpleType
    ? T[K] | ((value: T[K], obj: T) => boolean)
    : (value: T[K], obj: T) => boolean;
};

/**
 * Returns a shallow copy of the input object with certain properties omitted based on a provided rule map.
 *
 * Each entry in the `map` defines a rule for whether to omit a property from the result:
 * - If the property value is a simple type (string, number, etc.), the map can specify:
 *   - a literal value to match (if equal, the property is omitted)
 *   - a function `(value, obj) => boolean` that returns true if the property should be omitted
 * - If the property is a complex type (object or function), only a function is allowed in the map.
 *
 * @template T - The type of the input object
 * @param obj - The object to filter
 * @param map - A map defining which attributes to omit
 * @param deep - If true, performs a deep clone before omitting attributes; otherwise, a shallow copy.
 * @returns A new object with selected attributes removed
 * @throws TypeError if a non-function rule is provided for a complex property
 */
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

/**
 * Completes a partial object by filling in missing attributes using a mapping of default values or generator functions.
 *
 * For each key in the `map`:
 * - If the property is missing or `undefined` in the input, it will be added to the result:
 *   - If the map entry is a function `(obj) => value`, the result is computed dynamically
 *   - If it's a constant value (for simple types), it is directly assigned
 *
 * @template T - The type of the resulting complete object
 * @param input - A partial version of the target object
 * @param map - A map of default values or functions to supply missing properties
 * @param deep - If true, performs a deep clone of the input object before amending
 * @returns A fully constructed object of type `T`
 */
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
