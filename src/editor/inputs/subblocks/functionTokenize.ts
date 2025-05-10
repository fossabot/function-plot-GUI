const fns = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "abs",
  "sqrt",
  "log",
].sort((a, b) => b.length - a.length);

const nums = ["PI", "E"];

const ops = ["+", "-", "*", "/", "^", ","];

const lBracket = "(";
const rBracket = ")";

import globalLigs from "./fontLigs.json";
const ligs = globalLigs
  .sort((a, b) => b.length - a.length)
  .map((lig) => lig.replace(/-/g, ""));

type Token = {
  index: number;
  raw: string;
  type:
    | "function"
    | "operator"
    | "bracket"
    | "number"
    | "identifier"
    | "space"
    | "unknown";
  level?: number;
  err?: boolean;
  sqrtLevel?: number;
  sqrtIncrement?: number;
};

type EaterResult = {
  token?: Token;
  increment: number;
};

type SomePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Eater = (
  eating: string | number,
  token?: SomePartial<Token, "index">
) => EaterResult;

type Tokenizer = (
  eat: Eater,
  rest: string,
  tokens: Token[],
  index: number
) => EaterResult;

function tokenizeHelper(
  str: string,
  tokenizer: Tokenizer,
  ...postProcess: ((tokens: Token[]) => void)[]
): Token[] {
  const length = str.length;
  let increment = 1;
  let tokens: Token[] = [];
  for (let index = 0; index < length; index += increment) {
    const rest = str.slice(index);
    const eater: Eater = (eating, token) => {
      if (typeof eating === "string") {
        if (!rest.startsWith(eating)) throw new Error("Invalid eating");
        eating = eating.length;
      }
      return {
        token: token ? { ...token, index } : undefined,
        increment: eating,
      };
    };
    const { token, increment: currentIncrement } = tokenizer(
      eater,
      rest,
      tokens,
      index
    );
    increment = currentIncrement;
    if (token) tokens.push(token);
  }
  for (const fn of postProcess) fn(tokens);
  return tokens;
}

const isOperator = (token: string): boolean => ops.includes(token);
const hasFunction = (str: string): string | undefined => {
  for (const fn of fns) if (str.startsWith(fn)) return fn;
};
const hasIdentifier = (
  str: string,
  identifiers: string[]
): string | undefined => {
  for (const id of identifiers) if (str.startsWith(id)) return id;
};
const hasNumber = (str: string): string | undefined => {
  const match = str.match(/^\d+(\.\d+)?([Ee][+-]\d+)?/);
  if (match) return match[0];
  for (const num of nums) if (str.startsWith(num)) return num;
};
const hasSpace = (str: string): string | undefined => {
  const match = str.match(/^\s+/);
  if (match) return match[0];
};
const hasLigs = (str: string): string | undefined => {
  for (const lig of ligs) if (str.startsWith(lig)) return lig;
};

const getTokenizer: (identifiers: string[]) => Tokenizer =
  (identifiers) => (eat, rest) => {
    const ch = rest[0];
    const sapce = hasSpace(rest);
    if (sapce) {
      return eat(sapce, {
        raw: sapce,
        type: "space",
      });
    }
    const num = hasNumber(rest);
    if (num) {
      return eat(num, {
        raw: num,
        type: "number",
      });
    }
    const fn = hasFunction(rest);
    if (fn)
      return eat(fn, {
        raw: fn,
        type: "function",
      });
    if (isOperator(ch))
      return eat(1, {
        raw: ch,
        type: "operator",
      });
    if (ch === lBracket)
      return eat(1, {
        raw: lBracket,
        type: "bracket",
      });
    if (ch === rBracket) {
      return eat(1, {
        raw: rBracket,
        type: "bracket",
      });
    }
    const id = hasIdentifier(rest, identifiers);
    if (id)
      return eat(id, {
        raw: id,
        type: "identifier",
      });
    const lig = hasLigs(rest);
    if (lig) {
      return eat(lig, {
        raw: lig,
        type: "unknown",
      });
    }
    return eat(1, {
      type: "unknown",
      raw: ch,
    });
  };

function processBrackets(tokens: Token[]) {
  const tokenWithoutSpace = tokens.filter(({ type }) => type !== "space");
  let bracketLevel = 0;
  const bracketStack: {
    raw: "(" | ")";
    token: Token;
    sqrt?: boolean;
  }[] = [];
  tokenWithoutSpace.forEach((token, index) => {
    if (token.type !== "bracket") return;
    if (token.raw === lBracket) {
      bracketLevel = 0;
      let sqrt = tokenWithoutSpace[index - 1]?.raw === "sqrt";
      bracketStack.push({
        raw: lBracket,
        token,
        sqrt,
      });
      token.sqrtIncrement = sqrt ? 1 : 0;
    } else {
      const lastBracket = bracketStack.pop();
      if (lastBracket) {
        bracketLevel++;
        lastBracket.token.level = bracketLevel;
        token.level = bracketLevel;
        if (lastBracket.sqrt) {
          token.sqrtIncrement = -1;
        }
      } else {
        token.err = true;
      }
    }
    let sqrtLevel = 0;
    tokens.forEach((token) => {
      if (token.raw === lBracket) sqrtLevel += token.sqrtIncrement || 0;
      token.sqrtLevel = sqrtLevel;
      if (token.raw === rBracket) sqrtLevel += token.sqrtIncrement || 0;
    });
  });
  if (bracketStack.length) {
    bracketStack.forEach(({ token }) => {
      token.err = true;
    });
  }
}

function processFunction(tokens: Token[]) {
  const tokenWithoutSpace = tokens.filter(({ type }) => type !== "space");
  tokenWithoutSpace.forEach((token, index) => {
    if (token.type !== "function") return;
    const nextToken = tokenWithoutSpace[index + 1];
    console.log(token, nextToken);
    if (!nextToken || nextToken.raw !== lBracket) {
      token.err = true;
    }
  });
}

export const tokenize = (str: string, identifiers: string[]) => {
  const tokens = tokenizeHelper(
    str,
    getTokenizer(identifiers),
    processBrackets,
    processFunction
  );
  console.log(identifiers);
  return tokens;
};
