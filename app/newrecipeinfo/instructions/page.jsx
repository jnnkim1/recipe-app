"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      <button
        onClick={handleSaveInstructions}
        disabled={loading}
        className="bg-[#D17368] mt-5 text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer w-1/3 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Finishing..." : "Done"}
      </button>
    </main>
  );
}
