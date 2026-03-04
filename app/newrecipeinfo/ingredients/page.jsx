"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import IngredientList from "../../components/IngredientList";

export default function Ingredients() {
  const router = useRouter();
  const [recipeId, setRecipeId] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", measurement: "Cups" },
  ]);

  useEffect(() => {
    const id = localStorage.getItem("currentRecipeId");
    const name = localStorage.getItem("currentRecipeName");
    if (id) {
      setRecipeId(id);
    }
    if (name) {
      setRecipeName(name);
    }
  }, []);

  const handleSaveIngredients = async () => {
    if (!recipeId) {
      setError("No recipe found. Please go back and create a recipe first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recipes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId,
          ingredients: ingredients.filter((ing) => ing.name.trim() !== ""),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/newrecipeinfo/instructions");
      } else {
        setError(data.error || "Failed to save ingredients");
      }
    } catch (err) {
      setError("An error occurred while saving ingredients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ml-12 pr-12">
      <h1 className="text-7xl font-bold text-[#D17368] mt-10 mb-10">{recipeName}</h1>
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-[5fr_1fr] gap-4 mb-2 px-2">
          <label className="font-bold text-[#D17368]">INGREDIENTS</label>
          <label className="font-bold text-[#D17368]">MEASUREMENTS</label>
        </div>
        <IngredientList value={ingredients} onChange={setIngredients} />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-4">
          {error}
        </div>
      )}
      <button
        onClick={handleSaveIngredients}
        disabled={loading}
        className="bg-[#D17368] mt-5 text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer w-1/3 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Saving..." : "Next: Add Instructions"}
      </button>
    </main>
  );
}
