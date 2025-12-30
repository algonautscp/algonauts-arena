type Variant = "green" | "yellow" | "gray";

const variantStyles: Record<Variant, string> = {
  green: "bg-emerald-600",
  yellow: "bg-yellow-600",
  gray: "bg-slate-600",
};

export default function Badge({
  text,
  variant,
}: {
  text: string;
  variant: Variant;
}) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded ${variantStyles[variant]}`}
    >
      {text}
    </span>
  );
}
