import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import DailySummary from "./components/DailySummary";
import AddMealForm from "./components/AddMealForm";
import MealList from "./components/MealList";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate, delta) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [mealsByDate, setMealsByDate] = useState({});
  const [goal, setGoal] = useState(2200);

  // Load once
  useEffect(() => {
    try {
      const rawMeals = localStorage.getItem("cc_meals");
      const rawGoal = localStorage.getItem("cc_goal");
      if (rawMeals) setMealsByDate(JSON.parse(rawMeals));
      if (rawGoal) setGoal(Number(rawGoal) || 2200);
    } catch (e) {
      console.error("Failed to load", e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem("cc_meals", JSON.stringify(mealsByDate));
    } catch {}
  }, [mealsByDate]);

  useEffect(() => {
    try {
      localStorage.setItem("cc_goal", String(goal));
    } catch {}
  }, [goal]);

  const meals = mealsByDate[selectedDate] || [];

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => {
        acc.calories += Number(m.calories) || 0;
        acc.protein += Number(m.protein) || 0;
        acc.carbs += Number(m.carbs) || 0;
        acc.fat += Number(m.fat) || 0;
        acc.count += 1;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 }
    );
  }, [meals]);

  const mealsByType = useMemo(() => {
    return meals.reduce(
      (acc, m) => {
        (acc[m.type] = acc[m.type] || []).push(m);
        return acc;
      },
      { breakfast: [], lunch: [], dinner: [], snack: [] }
    );
  }, [meals]);

  function handleAddMeal(meal) {
    setMealsByDate((prev) => {
      const dayMeals = prev[selectedDate] ? [...prev[selectedDate]] : [];
      dayMeals.unshift(meal);
      return { ...prev, [selectedDate]: dayMeals };
    });
  }

  function handleDeleteMeal(id) {
    setMealsByDate((prev) => {
      const dayMeals = (prev[selectedDate] || []).filter((m) => m.id !== id);
      return { ...prev, [selectedDate]: dayMeals };
    });
  }

  function handleUpsertMeal(updated) {
    setMealsByDate((prev) => {
      const dayMeals = [...(prev[selectedDate] || [])];
      const idx = dayMeals.findIndex((m) => m.id === updated.id);
      if (idx >= 0) {
        dayMeals[idx] = updated; // edit existing
      } else {
        dayMeals.unshift(updated); // add new (e.g., duplicate)
      }
      return { ...prev, [selectedDate]: dayMeals };
    });
  }

  function clearDay() {
    if (!meals.length) return;
    if (!confirm("Clear all meals for this day?")) return;
    setMealsByDate((prev) => ({ ...prev, [selectedDate]: [] }));
  }

  function copyFromPreviousDay() {
    const prevDay = addDays(selectedDate, -1);
    const prevMeals = mealsByDate[prevDay] || [];
    if (!prevMeals.length) return alert("No meals on the previous day to copy.");
    if (!confirm("Copy all meals from the previous day?")) return;
    const cloned = prevMeals.map((m) => ({ ...m, id: crypto.randomUUID(), createdAt: new Date().toISOString() }));
    setMealsByDate((prev) => ({ ...prev, [selectedDate]: [...cloned, ...(prev[selectedDate] || [])] }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ mealsByDate, goal }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calorie-companion-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed && typeof parsed === "object") {
          if (parsed.mealsByDate) setMealsByDate(parsed.mealsByDate);
          if (parsed.goal) setGoal(Number(parsed.goal) || 2200);
        }
      } catch (e) {
        alert("Failed to import file");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        onPrevDay={() => setSelectedDate((d) => addDays(d, -1))}
        onNextDay={() => setSelectedDate((d) => addDays(d, 1))}
        onToday={() => setSelectedDate(getToday())}
        onExport={exportData}
        onImport={importData}
      />

      <DailySummary totals={totals} goal={goal} onChangeGoal={setGoal} onClearDay={clearDay} onCopyPrev={copyFromPreviousDay} />

      <AddMealForm onAdd={handleAddMeal} />

      <MealList mealsByType={mealsByType} onDelete={handleDeleteMeal} onEdit={handleUpsertMeal} />

      <footer className="fixed bottom-0 left-0 right-0 mx-auto max-w-md px-4 pb-4">
        <div className="rounded-2xl border bg-white shadow-sm px-4 py-2 text-center text-xs text-muted-foreground">
          Tip: Use the arrows to move days. Export your data to back it up.
        </div>
      </footer>
    </div>
  );
}
