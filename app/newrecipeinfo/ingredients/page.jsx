"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

    const validQuantity = /^\d+(?:\.\d+)?$|^\d+\/\d+$|^\d+\s+\d+\/\d+$/;
    const hasInvalidQuantity = ingredients.some((ingredient) => {
      if (!ingredient.name.trim()) return false;
      const quantity = ingredient.quantity.trim();
      const denominator = quantity.includes("/")
        ? Number(quantity.split("/").at(-1))
        : 1;
      return !validQuantity.test(quantity) || denominator === 0;
    });

    if (hasInvalidQuantity) {
      setError("Use a number, decimal, fraction (3/4), or mixed fraction (1 1/2) for each quantity.");
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

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel? This recipe won't be saved and all of its information will be deleted."
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    const draftRecipeId = localStorage.getItem("currentRecipeId") || recipeId;

    try {
      if (draftRecipeId) {
        const response = await fetch(`/api/recipes/${draftRecipeId}`, {
          method: "DELETE",
        });

        if (!response.ok && response.status !== 404) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete the recipe");
        }
      }

      localStorage.removeItem("currentRecipeId");
      localStorage.removeItem("currentRecipeName");
      setIngredients([{ name: "", quantity: "", measurement: "Cups" }]);
      router.push("/recipes");
    } catch (err) {
      setError(err.message || "Failed to cancel the recipe");
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
      <div className="mt-5 flex w-full gap-4">
        <button
          onClick={handleSaveIngredients}
          disabled={loading}
          className="flex-1 bg-[#D17368] text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Saving..." : "Next: Add Instructions"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 bg-[#E7DEDB] px-6 text-[#D17368] font-semibold py-3 rounded-xl hover:bg-gray-300 transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
      </div>
    </main>
  );
}
