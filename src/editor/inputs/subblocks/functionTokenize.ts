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

const ops = ["+", "-", "*", "/", "^", ","];

const lBracket = "(";
const rBracket = ")";

const extraIdentifiers = ["x", "theta"];

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
const hasIdentifier = (str: string): string | undefined => {
  for (const id of extraIdentifiers) if (str.startsWith(id)) return id;
  // const ch = str[0];
  // if (ch >= "a" && ch <= "z") return ch;
  // if (ch >= "A" && ch <= "Z") return ch;
};
const hasNumber = (str: string): string | undefined => {
  const match = str.match(/^\d+(\.\d+)?([Ee][+-]\d+)?/);
  if (match) return match[0];
};
const hasSpace = (str: string): string | undefined => {
  const match = str.match(/^\s+/);
  if (match) return match[0];
};

const tokenizer: Tokenizer = (eat, rest) => {
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
  const id = hasIdentifier(rest);
  if (id)
    return eat(id, {
      raw: id,
      type: "identifier",
    });
  return eat(1, {
    type: "unknown",
    raw: ch,
  });
};

function processBrackets(tokens: Token[]) {
  let bracketLevel = 0;
  const bracketStack: {
    raw: "(" | ")";
    token: Token;
  }[] = [];
  tokens.forEach((token) => {
    if (token.type !== "bracket") return;
    if (token.raw === lBracket) {
      bracketLevel = 0;
      bracketStack.push({
        raw: lBracket,
        token,
      });
    } else {
      const lastBracket = bracketStack.pop();
      if (lastBracket) {
        bracketLevel++;
        lastBracket.token.level = bracketLevel;
        token.level = bracketLevel;
      } else {
        token.type = "unknown";
      }
    }
  });
}

const tokens = tokenizeHelper(
  "2.5*(sin(x) + cos(y)+(2.6e-2*(1+3)))",
  tokenizer,
  processBrackets
);

console.log(tokens);

export const tokenize = (str: string) =>
  tokenizeHelper(str, tokenizer, processBrackets);
