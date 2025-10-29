import { PlusCircle, Utensils, Zap } from "lucide-react";
import { useMemo, useState } from "react";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

const PRESETS = [
  { name: "Protein Shake", calories: 180, protein: 30, carbs: 6, fat: 3, type: "snack" },
  { name: "Oats & Berries", calories: 350, protein: 12, carbs: 60, fat: 6, type: "breakfast" },
  { name: "Chicken Salad", calories: 420, protein: 38, carbs: 18, fat: 20, type: "lunch" },
];

export default function AddMealForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    type: "lunch",
  });
  const [autoCalories, setAutoCalories] = useState(true);

  const calculatedCalories = useMemo(() => {
    const p = Number(form.protein) || 0;
    const c = Number(form.carbs) || 0;
    const f = Number(form.fat) || 0;
    const calc = p * 4 + c * 4 + f * 9;
    return calc;
  }, [form.protein, form.carbs, form.fat]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handlePreset(p) {
    setForm({ ...p, calories: String(p.calories) });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || (!form.calories && !autoCalories)) return;
    const meal = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      calories: autoCalories ? calculatedCalories : Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      type: form.type,
      createdAt: new Date().toISOString(),
    };
    onAdd(meal);
    setForm({ name: "", calories: "", protein: "", carbs: "", fat: "", type: form.type });
  }

  return (
    <section className="mx-auto max-w-md px-4 pb-2">
      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Utensils size={18} />
            </div>
            <h2 className="font-semibold">Add a Meal</h2>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={autoCalories} onChange={(e) => setAutoCalories(e.target.checked)} />
            Auto-calc kcal
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Meal name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Chicken salad"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {!autoCalories && (
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Calories</label>
              <input
                name="calories"
                type="number"
                inputMode="numeric"
                min="0"
                value={form.calories}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Protein (g)</label>
            <input
              name="protein"
              type="number"
              inputMode="numeric"
              min="0"
              value={form.protein}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Carbs (g)</label>
            <input
              name="carbs"
              type="number"
              inputMode="numeric"
              min="0"
              value={form.carbs}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Fat (g)</label>
            <input
              name="fat"
              type="number"
              inputMode="numeric"
              min="0"
              value={form.fat}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Meal type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MEAL_TYPES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handlePreset(p)}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 text-xs"
              title={`Add ${p.name}`}
            >
              <Zap size={12} /> {p.name}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-between rounded-lg bg-indigo-600 text-white py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors px-3"
        >
          <span className="inline-flex items-center gap-2"><PlusCircle size={18} /> Add Meal</span>
          <span className="text-xs text-white/80">{autoCalories ? `${calculatedCalories} kcal` : `${Number(form.calories)||0} kcal`}</span>
        </button>
      </form>
    </section>
  );
}
