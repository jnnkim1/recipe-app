"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IngredientList from "../../../components/IngredientList";
import InstructionList from "../../../components/InstructionList";

const emptyIngredient = { name: "", quantity: "", measurement: "Cups" };
const emptyInstruction = { step: "" };

export default function EditRecipe() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([emptyIngredient]);
  const [instructions, setInstructions] = useState([emptyInstruction]);
  const [recipeImage, setRecipeImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("/black.png");
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load recipe");
        if (!active) return;

        setRecipeName(data.recipeName || "");
        setDescription(data.description || "");
        setIngredients(
          data.ingredients?.length
            ? data.ingredients.map((ingredient) =>
                typeof ingredient === "string"
                  ? { name: ingredient, quantity: "", measurement: "Cups" }
                  : ingredient
              )
            : [emptyIngredient]
        );
        setInstructions(
          data.instructions?.length
            ? data.instructions.map((instruction) =>
                typeof instruction === "string" ? { step: instruction } : instruction
              )
            : [emptyInstruction]
        );
        setImagePreview(data.image ? `data:image/png;base64,${data.image}` : "/black.png");
      } catch (err) {
        if (active) setError(err.message || "Failed to load recipe");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRecipe();
    return () => {
      active = false;
    };
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setRecipeImage(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleDeleteImage = () => {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setRecipeImage(null);
    setImagePreview("/black.png");
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("recipeName", recipeName);
    formData.append("description", description);
    formData.append(
      "ingredients",
      JSON.stringify(ingredients.filter((ingredient) => ingredient.name.trim() !== ""))
    );
    formData.append(
      "instructions",
      JSON.stringify(instructions.filter((instruction) => instruction.step.trim() !== ""))
    );
    formData.append("removeImage", String(removeImage));
    if (recipeImage) formData.append("recipeImage", recipeImage);

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update recipe");
      router.push("/recipes");
      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to update recipe");
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-xl font-semibold text-[#D17368]">Loading recipe...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <h1 className="ml-10 mt-10 text-7xl font-bold text-[#D17368]">EDIT RECIPE</h1>
      <form className="mt-10 flex items-start bg-[#FFF2DF] pb-12" onSubmit={handleSave}>
        <section className="flex flex-col items-start pl-10">
          <div className="mt-2 aspect-square w-110">
            <img
              className="h-full w-full rounded-xl object-cover"
              src={imagePreview}
              alt={recipeName}
            />
          </div>
          <div className="mt-4 flex w-full justify-center gap-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer font-semibold text-[#D17368] underline"
            >
              Upload Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="cursor-pointer font-semibold text-[#D17368] underline"
            >
              Delete Image
            </button>
          </div>
        </section>

        <section className="ml-10 mr-10 mt-2 flex flex-1 flex-col gap-5">
          {error && (
            <div className="rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="ml-3 font-bold text-[#D17368]">Recipe Name</label>
            <input
              type="text"
              value={recipeName}
              onChange={(event) => setRecipeName(event.target.value)}
              className="rounded-xl border-2 border-[#D17368] bg-[#F5BAA7] px-4 py-3 text-[#4A2C2A] caret-[#D17368] focus:outline-none focus:ring-2 focus:ring-[#D17368]"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="ml-3 font-bold text-[#D17368]">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="resize-none rounded-xl border-2 border-[#D17368] bg-[#F5BAA7] px-4 py-3 text-[#4A2C2A] caret-[#D17368] focus:outline-none focus:ring-2 focus:ring-[#D17368]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="ml-3 font-bold text-[#D17368]">Ingredients</label>
            <IngredientList value={ingredients} onChange={setIngredients} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="ml-3 font-bold text-[#D17368]">Instructions</label>
            <InstructionList value={instructions} onChange={setInstructions} />
          </div>

          <div className="mt-3 flex w-full gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 cursor-pointer rounded-xl bg-[#D17368] py-3 font-semibold text-white transition hover:bg-[#b5645b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/recipes")}
              disabled={saving}
              className="flex-1 cursor-pointer rounded-xl bg-[#E7DEDB] py-3 font-semibold text-[#D17368] transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
