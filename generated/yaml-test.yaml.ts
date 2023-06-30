type TyplateArgs<Fn> = Fn extends (a: infer A) => string ? A : never;

  type Args = {
    key: string,
    value: number,
    opts: {
      [key: string]: string,
    },
  };

export default function render(args: Args) {
  const __typelate_print_segments: string[] = [];

  __typelate_print_segments.push("");
__typelate_print_segments.push("topLevel:\n");
__typelate_print_segments.push("  ");
__typelate_print_segments.push( args.key );
__typelate_print_segments.push(": ");
__typelate_print_segments.push( `${args.value}` );
__typelate_print_segments.push("\n");
__typelate_print_segments.push("");
 for(const key in args.opts) { 
__typelate_print_segments.push("");
__typelate_print_segments.push("  ");
__typelate_print_segments.push( key );
__typelate_print_segments.push(": ");
__typelate_print_segments.push( args.opts[key] );
__typelate_print_segments.push("\n");
__typelate_print_segments.push("");
 } 
  return __typelate_print_segments.join("");
}