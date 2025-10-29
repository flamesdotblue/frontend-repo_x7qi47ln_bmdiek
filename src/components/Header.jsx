import { Calendar, Flame, ChevronLeft, ChevronRight, Download, Upload } from "lucide-react";
import { useRef } from "react";

export default function Header({ selectedDate, onChangeDate, onPrevDay, onNextDay, onToday, onExport, onImport }) {
  const today = new Date().toISOString().slice(0, 10);
  const fileRef = useRef(null);

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

        <div className="flex items-center gap-2">
          <button onClick={onPrevDay} className="p-2 rounded-md hover:bg-gray-100" aria-label="Previous day">
            <ChevronLeft size={18} />
          </button>
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
          <button onClick={onNextDay} className="p-2 rounded-md hover:bg-gray-100" aria-label="Next day">
            <ChevronRight size={18} />
          </button>
          <button onClick={onToday} className="ml-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50">Today</button>

          <button onClick={onExport} className="ml-2 p-2 rounded-md hover:bg-gray-100" title="Export JSON" aria-label="Export">
            <Download size={16} />
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} className="p-2 rounded-md hover:bg-gray-100" title="Import JSON" aria-label="Import">
            <Upload size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
