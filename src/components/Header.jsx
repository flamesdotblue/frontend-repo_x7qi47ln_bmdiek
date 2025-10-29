import { Calendar, Flame } from "lucide-react";

export default function Header({ selectedDate, onChangeDate }) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
            <Flame size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">Calorie Companion</h1>
            <p className="text-xs text-muted-foreground">Track meals and macros</p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Calendar size={18} className="text-muted-foreground" />
          <input
            type="date"
            max={today}
            value={selectedDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </label>
      </div>
    </header>
  );
}
