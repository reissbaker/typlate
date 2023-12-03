type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;
export const filepath = "examples/user-partial.md";

  type Args = {
    name: string,
    bio: string,
    employedSince: string,
  };

export default function render(args: Args) {
  const __typelate_print_segments: string[] = [];

  __typelate_print_segments.push("");
__typelate_print_segments.push("## ");
__typelate_print_segments.push( args.name );
__typelate_print_segments.push("\n");
__typelate_print_segments.push("\n_");
__typelate_print_segments.push( args.employedSince );
__typelate_print_segments.push("_\n\n");
__typelate_print_segments.push( args.bio );
__typelate_print_segments.push("\n");
  return __typelate_print_segments.join("");
}