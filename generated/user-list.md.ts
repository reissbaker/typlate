type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;

  import userPartial from "./user-partial.md";

  type Args = {
    users: Array<TyplateArgs<typeof userPartial>>,
  };

export default function render(args: Args) {
  const __typlate_segments: string[] = [];
  const print = (str: string) => __typlate_segments.push(str);

  print("");
print("\n# Employee directory\n\nThis is a very big company and we have many employees. Wow, pretty amazing.\nAnyway, here they are:\n");
 for(const user of args.users) { 
print("\n");
print( userPartial({
    name: user.name,
    bio: user.bio,
    employedSince: user.employedSince,
  }) );
 } 
  return __typlate_segments.join("");
}