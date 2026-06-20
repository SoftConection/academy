import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    ms,
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown({ target, onExpire }: { target: number; onExpire?: () => void }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => {
      const next = diff(target);
      setT(next);
      if (next.ms === 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onExpire]);

  const Box = ({ v, label }: { v: number; label: string }) => (
    <div className="flex flex-col items-center rounded-lg bg-background px-3 py-2 shadow-soft">
      <span className="font-display text-2xl font-extrabold tabular-nums">{String(v).padStart(2, "0")}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-2">
      <Box v={t.d} label="dias" />
      <Box v={t.h} label="horas" />
      <Box v={t.m} label="min" />
      <Box v={t.s} label="seg" />
    </div>
  );
}
