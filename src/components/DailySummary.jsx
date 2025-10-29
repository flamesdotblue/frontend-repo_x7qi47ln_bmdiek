import { Apple, BarChart3 } from "lucide-react";

export default function DailySummary({ goal = 2200, totals }) {
  const remaining = Math.max(goal - totals.calories, 0);

  const MacroBar = ({ label, value, goal, color }) => {
    const percent = Math.min((value / goal) * 100, 100);
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span>
            {value}g / {goal}g
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-md px-4 pt-4 pb-3">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <Apple size={18} />
          </div>
          <h2 className="font-semibold">Today’s Summary</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-orange-50 p-3">
            <p className="text-xs text-muted-foreground">Eaten</p>
            <p className="text-2xl font-bold text-orange-600">{totals.calories}</p>
            <p className="text-[10px] text-muted-foreground">calories</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-emerald-600">{remaining}</p>
            <p className="text-[10px] text-muted-foreground">of {goal}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3">
            <p className="text-xs text-muted-foreground">Meals</p>
            <p className="text-2xl font-bold text-indigo-600">{totals.count}</p>
            <p className="text-[10px] text-muted-foreground">logged</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BarChart3 size={16} className="text-muted-foreground" />
            Macro Breakdown
          </div>
          <MacroBar label="Protein" value={totals.protein} goal={140} color="#ef4444" />
          <MacroBar label="Carbs" value={totals.carbs} goal={250} color="#3b82f6" />
          <MacroBar label="Fat" value={totals.fat} goal={70} color="#f59e0b" />
        </div>
      </div>
    </section>
  );
}
