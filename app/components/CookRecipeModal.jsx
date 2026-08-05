"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CookRecipeModal({ isOpen, onClose }) {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const loadRecipes = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/recipes");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load recipes");
        if (active) setRecipes(data);
      } catch (err) {
        if (active) setError(err.message || "Failed to load recipes");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRecipes();
    return () => {
      active = false;
    };
  }, [isOpen, reloadKey]);

  if (!isOpen) return null;

  const startCookMode = (recipe) => {
    localStorage.setItem("cookModeRecipe", JSON.stringify(recipe));
    onClose();
    router.push(`/cook?recipeId=${recipe._id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 p-4" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cook-recipe-title"
        className="w-full max-w-3xl overflow-hidden rounded-3xl border-4 border-[#D17368] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between bg-[#D17368] px-7 py-5 text-white">
          <div>
            <h2 id="cook-recipe-title" className="text-3xl font-bold">Choose a Recipe</h2>
            <p className="mt-1 text-sm text-white/80">Which recipe would you like to cook?</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close recipe selection" className="cursor-pointer text-4xl leading-none transition hover:text-gray-200">
            &times;
          </button>
        </header>

        <div className="recipe-modal-scroll-area max-h-[65vh] overflow-y-auto bg-[#FFF2DF] p-6">
          {loading ? (
            <p className="py-12 text-center text-xl font-semibold text-[#D17368]">Loading your recipes...</p>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-lg font-semibold text-red-600">{error}</p>
              <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-5 rounded-xl bg-[#D17368] px-6 py-3 font-bold text-white">
                Try Again
              </button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-lg text-gray-700">You don&apos;t have any recipes to cook yet.</p>
              <button type="button" onClick={() => router.push("/newrecipeinfo")} className="mt-5 rounded-xl bg-[#D17368] px-6 py-3 font-bold text-white">
                Create a Recipe
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recipes.map((recipe) => (
                <button
                  type="button"
                  key={recipe._id}
                  onClick={() => startCookMode(recipe)}
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-[#E7DEDB] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#D17368] hover:shadow-md"
                >
                  <img
                    src={recipe.image ? `data:image/png;base64,${recipe.image}` : "/black.png"}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-xl font-bold text-[#D17368]">{recipe.recipeName}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{recipe.description}</p>
                    <span className="mt-2 inline-block text-sm font-bold text-[#D17368] group-hover:underline">Start cooking →</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <footer className="bg-white p-4 text-right">
          <button type="button" onClick={onClose} className="cursor-pointer rounded-xl bg-[#E7DEDB] px-8 py-3 font-bold text-[#D17368] transition hover:bg-gray-300">
            Cancel
          </button>
        </footer>
      </section>
    </div>
  );
}
