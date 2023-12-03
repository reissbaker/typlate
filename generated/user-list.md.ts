type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;
export const filepath = "examples/user-list.md";

  import userPartial from "./user-partial.md";

  type Args = {
    users: Array<TyplateArgs<typeof userPartial>>,
  };

export default function render(args: Args) {
  const __typelate_print_segments: string[] = [];

  __typelate_print_segments.push("");
__typelate_print_segments.push("\n# Employee directory\n\nThis is a very big company and we have many employees. Wow, pretty amazing.\nAnyway, here they are:\n\n");
 for(const user of args.users) { 
__typelate_print_segments.push("");
__typelate_print_segments.push( userPartial({
  name: user.name,
  bio: user.bio,
  employedSince: user.employedSince,
}) );
__typelate_print_segments.push("\n");
__typelate_print_segments.push("");
 } 
  return __typelate_print_segments.join("");
}