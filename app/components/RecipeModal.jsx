"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecipeModal({ recipe, isOpen, onClose }) {
  const router = useRouter();
  const [showIngredients, setShowIngredients] = useState(true);

  if (!isOpen || !recipe) return null;

  const handleCookMode = () => {
    localStorage.setItem("cookModeRecipe", JSON.stringify(recipe));
    router.push(`/cook?recipeId=${recipe._id}`);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-[#D17368]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center sticky top-0 bg-[#D17368] text-white p-6 z-10">
          <h1 className="text-3xl font-bold">{recipe.recipeName}</h1>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-gray-200 transition"
          >
            ×
          </button>
        </div>

        {/* Recipe Image */}
        <div className="w-full h-[300px] overflow-hidden">
          <img
            src={recipe.image ? `data:image/png;base64,${recipe.image}` : "/black.png"}
            alt={recipe.recipeName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Recipe Description */}
        <div className="p-6 border-b-2 border-[#E7DEDB]">
          <p className="text-gray-700 text-lg">{recipe.description}</p>
        </div>

        {/* Tabs for Ingredients/Instructions */}
        <div className="flex gap-4 p-6 border-b-2 border-[#E7DEDB] bg-[#FFF2DF]">
          <button
            onClick={() => setShowIngredients(true)}
            className={`px-6 py-2 font-semibold rounded-lg transition ${
              showIngredients
                ? "bg-[#D17368] text-white"
                : "bg-[#E7DEDB] text-[#D17368] hover:bg-gray-300"
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setShowIngredients(false)}
            className={`px-6 py-2 font-semibold rounded-lg transition ${
              !showIngredients
                ? "bg-[#D17368] text-white"
                : "bg-[#E7DEDB] text-[#D17368] hover:bg-gray-300"
            }`}
          >
            Instructions
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showIngredients ? (
            <div>
              <h2 className="text-2xl font-bold text-[#D17368] mb-4">Ingredients</h2>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="inline-block w-2 h-2 bg-[#D17368] rounded-full mr-3"></span>
                      {typeof ingredient === 'string' 
                        ? ingredient 
                        : `${ingredient.quantity} ${ingredient.measurement} ${ingredient.name}`
                      }
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No ingredients added yet.</p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-[#D17368] mb-4">Instructions</h2>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex text-gray-700">
                      <span className="font-bold text-[#D17368] mr-3 min-w-fit">Step {index + 1}:</span>
                      <span>
                        {typeof instruction === 'string' 
                          ? instruction 
                          : instruction.step
                        }
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500 italic">No instructions added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Cook Mode Button */}
        <div className="p-6 border-t-2 border-[#E7DEDB] bg-[#FFF2DF] flex gap-4">
          <button
            onClick={handleCookMode}
            className="flex-1 bg-[#D17368] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#b5645b] transition duration-300 text-lg"
          >
            Start Cook Mode
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#E7DEDB] text-[#D17368] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 text-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
