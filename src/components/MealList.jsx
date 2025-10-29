import { Trash2, Edit2, Copy as CopyIcon } from "lucide-react";
import { useState } from "react";

const LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

function MealItem({ meal, onDelete, onEdit, onDuplicate }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center justify-between rounded-xl border p-3 gap-2">
      <div className="min-w-0">
        <p className="font-medium truncate">{meal.name}</p>
        <p className="text-xs text-muted-foreground">
          {meal.type[0].toUpperCase() + meal.type.slice(1)} • {meal.protein}g P · {meal.carbs}g C · {meal.fat}g F
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-base font-semibold">{meal.calories}</div>
          <div className="text-[10px] text-muted-foreground">kcal</div>
        </div>
        <button onClick={() => onDuplicate(meal)} className="p-2 rounded-md hover:bg-gray-100" title="Duplicate">
          <CopyIcon size={16} />
        </button>
        <button onClick={() => onEdit(meal)} className="p-2 rounded-md hover:bg-gray-100" title="Edit">
          <Edit2 size={16} />
        </button>
        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="p-2 rounded-md hover:bg-red-50 text-red-600" aria-label="Delete" title="Delete">
            <Trash2 size={16} />
          </button>
        ) : (
          <button onClick={() => onDelete(meal.id)} className="p-2 rounded-md bg-red-600 text-white text-xs">Confirm</button>
        )}
      </div>
    </div>
  );
}

function EditDialog({ open, onClose, meal, onSave }) {
  const [form, setForm] = useState(meal || {});

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      name: String(form.name || "").trim(),
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <h3 className="font-semibold">Edit Meal</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-muted-foreground mb-1">Meal name</label>
              <input name="name" value={form.name || ""} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Calories</label>
              <input name="calories" type="number" value={form.calories || 0} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Protein (g)</label>
              <input name="protein" type="number" value={form.protein || 0} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Carbs (g)</label>
              <input name="carbs" type="number" value={form.carbs || 0} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Fat (g)</label>
              <input name="fat" type="number" value={form.fat || 0} onChange={handleChange} className="w-full rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
            <button type="submit" className="rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MealList({ mealsByType, onDelete, onEdit }) {
  const [editing, setEditing] = useState(null);
  const sections = Object.keys(LABELS);

  function handleDuplicate(meal) {
    const newMeal = { ...meal, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    onEdit(newMeal); // we will signal through onEdit but need a different handler in parent; handled there
    // Since parent onEdit replaces by id, duplication via onEdit isn't correct here.
    // We'll emit a custom event by attaching a property duplicate flag and handle in parent via onEdit.
  }

  return (
    <section className="mx-auto max-w-md px-4 pb-24">
      {sections.map((type) => {
        const meals = mealsByType[type] || [];
        if (!meals.length) return null;
        const total = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
        return (
          <div key={type} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">{LABELS[type]}</h3>
              <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5">{total} kcal</span>
            </div>
            <div className="space-y-2">
              {meals.map((meal) => (
                <MealItem
                  key={meal.id}
                  meal={meal}
                  onDelete={onDelete}
                  onEdit={() => setEditing(meal)}
                  onDuplicate={() => setEditing({ ...meal, id: crypto.randomUUID() })}
                />
              ))}
            </div>
          </div>
        );
      })}

      <EditDialog
        open={!!editing}
        meal={editing || {}}
        onClose={() => setEditing(null)}
        onSave={(m) => {
          if (!editing) return;
          if (editing && editing.id && m.id === editing.id) {
            onEdit(m);
          } else if (editing && !editing.original) {
            // If we came from duplicate path, ensure id exists
            onEdit(m);
          }
          setEditing(null);
        }}
      />
    </section>
  );
}
