import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import DailySummary from "./components/DailySummary";
import AddMealForm from "./components/AddMealForm";
import MealList from "./components/MealList";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [mealsByDate, setMealsByDate] = useState({});

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cc_meals");
      if (raw) setMealsByDate(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load meals", e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem("cc_meals", JSON.stringify(mealsByDate));
    } catch (e) {
      // ignore
    }
  }, [mealsByDate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header selectedDate={selectedDate} onChangeDate={setSelectedDate} />

      <DailySummary totals={totals} />

      <AddMealForm onAdd={handleAddMeal} />

      <MealList mealsByType={mealsByType} onDelete={handleDeleteMeal} />

      <footer className="fixed bottom-0 left-0 right-0 mx-auto max-w-md px-4 pb-4">
        <div className="rounded-2xl border bg-white shadow-sm px-4 py-2 text-center text-xs text-muted-foreground">
          Tip: Tap the date to review past days. Your entries are stored on this device.
        </div>
      </footer>
    </div>
  );
}

export default App;
