type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;

  type Args = {
    name: string,
    bio: string,
    employedSince: string,
  };

export default function render(args: Args) {
  const __typlate_segments: string[] = [];
  const print = (str: string) => __typlate_segments.push(str);

  print("");
print("\n## ");
print( args.name );
print("\n\n_");
print( args.employedSince );
print("_\n");
print("\n");
print( args.bio );
  return __typlate_segments.join("");
}