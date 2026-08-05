"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import RecipeCard from "@/app/components/RecipeCard";
import RecipeModal from "@/app/components/RecipeModal";

export default function Recipes() {
  const { status } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setError("Please log in to view your recipes");
      setLoading(false);
      return;
    }

    if (status === "authenticated") {
      fetchRecipes();
    }
  }, [status]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
      setError("");
    } catch (err) {
      setError("Error loading recipes: " + err.message);
      setRecipes([]);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.recipeName.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query)
      );
      setFilteredRecipes(filtered);
    }
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleRecipeDeleted = (recipeId) => {
    setRecipes((current) => current.filter((recipe) => recipe._id !== recipeId));
    setFilteredRecipes((current) => current.filter((recipe) => recipe._id !== recipeId));
    handleCloseModal();
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-[#FFF2DF]">
      <section className="w-1/2 justify-center items-center flex flex-col mt-10">
        <h1 className="text-7xl font-bold text-[#D17368]">MY RECIPES</h1>
        <input
          type="search"
          placeholder="Search for a recipe..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full mt-6
    text-[#D17368]
    placeholder:text-[#D17368]/60
    bg-[#E7DEDB]
    rounded-xl
    px-4
    py-3
    focus:ring-2
    focus:ring-[#D17368]
    focus:outline-none
    appearance-none"
        />
        <Link href="/newrecipeinfo">
          <button className="mt-6 px-6 py-3 bg-[#D17368] text-white font-semibold rounded-xl hover:bg-[#b5645b] transition duration-300">
            Create New Recipe
          </button>
        </Link>
      </section>

      <section className="w-full flex flex-wrap justify-center gap-8 mt-10 p-10">
        {loading ? (
          <div className="text-[#D17368] text-xl font-semibold">Loading your recipes...</div>
        ) : error ? (
          <div className="text-red-500 text-xl font-semibold">{error}</div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-[#D17368] text-xl font-semibold">
            {recipes.length === 0 ? "You haven't created any recipes yet!" : "No recipes match your search."}
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onViewRecipe={handleViewRecipe}
            />
          ))
        )}
      </section>

      <RecipeModal
        key={selectedRecipe?._id ?? "closed"}
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDeleted={handleRecipeDeleted}
      />
    </main>
  );
}
