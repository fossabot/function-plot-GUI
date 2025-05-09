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
];

const ops = ["+", "-", "*", "/", "^", ","];

const lBracket = "(";
const rBracket = ")";

const extraIdentifiers = ["theta"];

const isOperator = (token: string): boolean => ops.includes(token);
const hasFunction = (str: string): string | undefined => {
  for (const fn of fns) if (str.startsWith(fn)) return fn;
};
const hasIdentifier = (str: string): string | undefined => {
  for (const id of extraIdentifiers) if (str.startsWith(id)) return id;
  const ch = str[0];
  if (ch >= "a" && ch <= "z") return ch;
  if (ch >= "A" && ch <= "Z") return ch;
};

type Token = {
  index: number;
  raw: string;
  type:
    | "function"
    | "operator"
    | "bracket"
    | "number"
    | "identifier"
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

function tokenizeHelper(str: string, tokenizer: Tokenizer) {
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
  return tokens;
}

const bracketStack: {
  raw: "(" | ")";
  tokenIndex: number;
}[] = [];

const tokenizer: Tokenizer = (eat, rest, tokens, _index) => {
  const ch = rest[0];
  if (ch === " ") return eat(1);
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
  if (ch === lBracket) {
    bracketStack.push({
      raw: lBracket,
      tokenIndex: tokens.length,
    });
    return eat(1, {
      raw: lBracket,
      type: "bracket",
    });
  }
  if (ch === rBracket)
    return eat(1, {
      raw: rBracket,
      type: "bracket",
    });
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

console.log(tokenizeHelper("sin(x) + cos(y)", tokenizer));
