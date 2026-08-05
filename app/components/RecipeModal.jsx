"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecipeModal({ recipe, isOpen, onClose, onDeleted }) {
  const router = useRouter();
  const [showIngredients, setShowIngredients] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const scrollAreaRef = useRef(null);
  const scrollThumbRef = useRef(null);

  const updateScrollbar = () => {
    const scrollArea = scrollAreaRef.current;
    const scrollThumb = scrollThumbRef.current;

    if (!scrollArea || !scrollThumb) return;

    const scrollableDistance = scrollArea.scrollHeight - scrollArea.clientHeight;
    const thumbHeight = Math.max(
      12,
      (scrollArea.clientHeight / scrollArea.scrollHeight) * 100
    );
    const thumbTop = scrollableDistance > 0
      ? (scrollArea.scrollTop / scrollableDistance) * (100 - thumbHeight)
      : 0;

    scrollThumb.style.height = `${Math.min(100, thumbHeight)}%`;
    scrollThumb.style.top = `${thumbTop}%`;
    scrollThumb.style.display = scrollableDistance > 0 ? "block" : "none";
  };

  useEffect(() => {
    if (!isOpen) return;

    const frame = requestAnimationFrame(updateScrollbar);
    const observer = new ResizeObserver(updateScrollbar);

    if (scrollAreaRef.current) {
      observer.observe(scrollAreaRef.current);
      if (scrollAreaRef.current.firstElementChild) {
        observer.observe(scrollAreaRef.current.firstElementChild);
      }
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [isOpen, recipe, showIngredients]);

  if (!isOpen || !recipe) return null;

  const handleCookMode = () => {
    localStorage.setItem("cookModeRecipe", JSON.stringify(recipe));
    router.push(`/cook?recipeId=${recipe._id}`);
  };

  const handleEdit = () => {
    router.push(`/recipes/${recipe._id}/edit`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${recipe.recipeName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    setActionError("");

    try {
      const response = await fetch(`/api/recipes/${recipe._id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete recipe");
      }
      onDeleted?.(recipe._id);
    } catch (error) {
      setActionError(error.message || "Failed to delete recipe");
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-4 border-[#D17368]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={scrollAreaRef}
          onScroll={updateScrollbar}
          className="recipe-modal-scroll-area max-h-[calc(90vh-8px)] overflow-y-auto"
        >
        <div>
        {/* Close Button */}
        <div className="flex justify-between items-center sticky top-0 bg-[#D17368] text-white p-6 z-10">
          <h1 className="text-3xl font-bold">{recipe.recipeName}</h1>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-gray-200 transition cursor-pointer"
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

        {actionError && (
          <p className="mx-6 mb-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 border-t-2 border-[#E7DEDB] bg-[#FFF2DF] p-6">
          <button
            onClick={handleCookMode}
            disabled={deleting}
            className="bg-[#D17368] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#b5645b] transition duration-300 text-lg disabled:opacity-50"
          >
            Start Cook Mode
          </button>
          <button
            onClick={handleEdit}
            disabled={deleting}
            className="bg-[#F5BAA7] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#d99c89] transition duration-300 text-lg disabled:opacity-50"
          >
            Edit Recipe
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 text-lg disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Recipe"}
          </button>
          <button
            onClick={onClose}
            disabled={deleting}
            className="bg-[#E7DEDB] text-[#D17368] font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 text-lg disabled:opacity-50"
          >
            Close
          </button>
        </div>
        </div>
        </div>

        <div className="pointer-events-none absolute bottom-3 right-1 top-[5.75rem] z-20 w-4 rounded-full bg-[#E7DEDB]">
          <div
            ref={scrollThumbRef}
            className="absolute left-1 top-0 w-2 rounded-full bg-[#F5BAA7]"
          />
        </div>
      </div>
    </div>
  );
}
