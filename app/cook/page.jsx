"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Cook() {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("recipeId");
  const router = useRouter();

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        const data = await res.json();
        
        if (!res.ok) {
          console.error("API error:", data);
          setError(`Failed to fetch recipe: ${data.error || "Unknown error"}`);
          return;
        }
        
        console.log("Recipe data:", data);
        setRecipe(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching recipe");
      }
    };

    if (recipeId) {
      getRecipe();
    }
  }, [recipeId]);
  return (
    <main className="flex flex-col items-left p-10">
      {error && <p className="text-red-600">{error}</p>}
      {!recipe && !error && <p>Loading...</p>}
      {recipe && (
        <>
          <h1 className="text-7xl font-bold text-[#D17368] ml-10">{recipe?.recipeName}</h1>
          <section className="flex flex-wrap justify-left items-left p-3 bg-[#FFF2DF]">
            <div className="w-[500px] h-[500px] overflow-hidden">
              <img
                src={recipe?.image ? `data:image/png;base64,${recipe.image}` : "/black.png"}
                alt={recipe?.recipeName}
                className="w-full h-full object-cover"
              />
            </div>
            <section className="flex flex-col w-[470px] h-[500px] p-3">
              <div className="h-full w-full p-6">
              <h2 className="text-3xl font-bold text-[#D17368] mb-4">Description</h2>
              <p className="text-gray-700 text-lg mb-6">{recipe?.description}</p>
            </div>
              <div className="p-6">
              <button
                onClick={() => {
                  localStorage.setItem("cookModeRecipe", JSON.stringify(recipe));
                  router.push("/cook/ingredients");
                }}
                className="px-6 py-3 bg-[#D17368] text-white font-semibold rounded-lg hover:bg-[#A14B3C] transition"
              >
                Start Cooking!
              </button>
          </div>
            </section>
              
          </section>

        </>
      )}
    </main>
  );
}
