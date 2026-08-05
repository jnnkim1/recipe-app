"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InstructionList from "../../components/InstructionList";

export default function Instructions() {
  const router = useRouter();
  const [recipeId, setRecipeId] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [instructions, setInstructions] = useState([{ step: "" }]);

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

  const handleSaveInstructions = async () => {
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
          instructions: instructions.filter((inst) => inst.step.trim() !== ""),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("currentRecipeId");
        localStorage.removeItem("currentRecipeName");
        router.push("/recipes");
      } else {
        setError(data.error || "Failed to save instructions");
      }
    } catch (err) {
      setError("An error occurred while saving instructions");
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
      setInstructions([{ step: "" }]);
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
        <label className="ml-3 font-bold text-[#D17368]">
          INSTRUCTIONS
        </label>
        <InstructionList value={instructions} onChange={setInstructions} />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-4">
          {error}
        </div>
      )}
      <div className="mt-5 flex w-full gap-4">
        <button
          onClick={handleSaveInstructions}
          disabled={loading}
          className="flex-1 bg-[#D17368] text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Finishing..." : "Done"}
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
