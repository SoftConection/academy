import { Card } from "@/components/ui/card";

export function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <span className="font-display text-2xl font-extrabold">{value}</span>
        {delta && <span className="text-xs font-semibold text-primary">{delta}</span>}
      </div>
    </Card>
  );
}