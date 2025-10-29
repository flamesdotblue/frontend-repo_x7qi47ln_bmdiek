import { Trash2 } from "lucide-react";

const LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

function MealItem({ meal, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <div className="min-w-0">
        <p className="font-medium truncate">{meal.name}</p>
        <p className="text-xs text-muted-foreground">
          {meal.type[0].toUpperCase() + meal.type.slice(1)} • {meal.protein}g P · {meal.carbs}g C · {meal.fat}g F
        </p>
      </div>
      <div className="text-right">
        <div className="text-base font-semibold">{meal.calories}</div>
        <div className="text-[10px] text-muted-foreground">kcal</div>
      </div>
      <button
        onClick={() => onDelete(meal.id)}
        className="ml-2 p-2 rounded-md hover:bg-red-50 text-red-600"
        aria-label="Delete meal"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function MealList({ mealsByType, onDelete }) {
  const sections = Object.keys(LABELS);
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
                <MealItem key={meal.id} meal={meal} onDelete={onDelete} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
