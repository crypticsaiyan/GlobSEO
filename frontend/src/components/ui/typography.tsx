import { cn } from "./utils";

function Typography({
  variant,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "code"
    | "lead"
    | "large"
    | "small"
    | "muted";
}) {
  const Comp = variant === "blockquote" ? "blockquote" : "p";
  return (
    <Comp
      className={cn(
        {
          h1: "text-4xl font-extrabold tracking-tight",
          h2: "text-3xl font-semibold tracking-tight",
          h3: "text-2xl font-semibold tracking-tight",
          h4: "text-xl font-semibold tracking-tight",
          p: "leading-7",
          blockquote: "mt-6 border-l-2 pl-6 italic",
          code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          lead: "text-xl text-muted-foreground",
          large: "text-lg font-semibold",
          small: "text-sm font-medium leading-none",
          muted: "text-sm text-muted-foreground",
        }[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Typography };
