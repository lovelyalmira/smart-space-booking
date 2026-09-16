import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "bg-primary/10 text-primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
