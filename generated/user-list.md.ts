type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;

  import userPartial from "./user-partial.md";

  type Args = {
    users: Array<TyplateArgs<typeof userPartial>>,
  };

export default function render(args: Args) {
  const __typlate_segments: string[] = [];
  const print = (str: string) => __typlate_segments.push(str);

  // 0 0
print("");
// ^^ head slurp one line up
// 128
// 128 250
print("\n# Employee directory\n\nThis is a very big company and we have many employees. Wow, pretty amazing.\nAnyway, here they are:\n");
// ^^ regular run slurp one line up
// regular run
 for(const user of args.users) { 
// true false "<"
// 289
// ^^ expr slurp one line up
// expr
print("\n");
print( userPartial({
  name: user.name,
  bio: user.bio,
  employedSince: user.employedSince,
}) );
// true false "<"
// 386
// ^^ regular run slurp one line up
// regular run
 } 
// true false undefined
// 394
  return __typlate_segments.join("");
}