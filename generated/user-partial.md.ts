type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;

  type Args = {
    name: string,
    bio: string,
    employedSince: string,
  };

export default function render(args: Args) {
  const __typlate_segments: string[] = [];
  const print = (str: string) => __typlate_segments.push(str);

  // 0 0
print("");
// ^^ head slurp one line up
// 91
// 91 95
print("\n## ");
// ^^ expr slurp one line up
// expr
print( args.name );
// false true "\n"
// 111
// 111 114
print("\n\n_");
// ^^ expr slurp one line up
// expr
print( args.employedSince );
// false false "_"
// 139
// 139 141
print("_\n");
// ^^ expr slurp one line up
// expr
print("\n");
print( args.bio );
// true false undefined
// 158
  return __typlate_segments.join("");
}