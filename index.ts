export type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;
