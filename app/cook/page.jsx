"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const stepNames = ["Ready", "Ingredients", "Instructions", "Complete"];

function parseQuantity(quantity) {
  const value = String(quantity ?? "").trim();
  if (!value) return null;
  const mixed = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const denominator = Number(mixed[3]);
    return denominator === 0
      ? null
      : Number(mixed[1]) + Number(mixed[2]) / denominator;
  }

  const fraction = value.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    return denominator === 0 ? null : Number(fraction[1]) / denominator;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function scaledQuantity(quantity, scale) {
  const parsed = parseQuantity(quantity);
  if (parsed === null) return quantity;

  const scaled = parsed * scale;
  const roundedInteger = Math.round(scaled);
  if (Math.abs(scaled - roundedInteger) < 0.001) return roundedInteger.toString();

  const whole = Math.floor(scaled);
  const remainder = scaled - whole;
  let bestNumerator = 0;
  let bestDenominator = 1;
  let smallestError = Infinity;

  for (let denominator = 2; denominator <= 16; denominator += 1) {
    const numerator = Math.round(remainder * denominator);
    const error = Math.abs(remainder - numerator / denominator);
    if (error < smallestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      smallestError = error;
    }
  }

  if (smallestError > 0.01) return Number(scaled.toFixed(2)).toString();

  const greatestCommonDivisor = (left, right) =>
    right === 0 ? left : greatestCommonDivisor(right, left % right);
  const divisor = greatestCommonDivisor(bestNumerator, bestDenominator);
  const numerator = bestNumerator / divisor;
  const denominator = bestDenominator / divisor;

  return whole > 0 ? `${whole} ${numerator}/${denominator}` : `${numerator}/${denominator}`;
}

function CookFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recipeId = searchParams.get("recipeId");
  const [recipe, setRecipe] = useState(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [scale, setScale] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [checkedInstructions, setCheckedInstructions] = useState([]);
  const [review, setReview] = useState("");
  const [dishImage, setDishImage] = useState(null);
  const [dishPreview, setDishPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadRecipe = async () => {
      try {
        const storedRecipe = localStorage.getItem("cookModeRecipe");
        const stored = storedRecipe ? JSON.parse(storedRecipe) : null;
        const id = recipeId || stored?._id;

        if (!id) throw new Error("Choose a recipe before starting cook mode.");

        const response = await fetch(`/api/recipes/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load recipe");

        if (active) {
          setRecipe(data);
          localStorage.setItem("cookModeRecipe", JSON.stringify(data));
        }
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
  }, [recipeId]);

  const moveTo = (nextStep) => {
    setDirection(nextStep > step ? "forward" : "backward");
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleChecked = (setter, index) => {
    setter((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  const cancelCookMode = () => {
    localStorage.removeItem("cookModeRecipe");
    router.push("/profilepage");
  };

  const handleDishImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (dishPreview.startsWith("blob:")) URL.revokeObjectURL(dishPreview);
    setDishImage(file);
    setDishPreview(URL.createObjectURL(file));
  };

  const finishCookMode = async () => {
    if (!review.trim()) {
      setError("Please write a review before finishing.");
      return;
    }

    setSubmitting(true);
    setError("");
    const formData = new FormData();
    formData.append("review", review.trim());
    if (dishImage) formData.append("dishImage", dishImage);

    try {
      const response = await fetch(`/api/recipes/${recipe._id}/reviews`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save review");

      localStorage.removeItem("cookModeRecipe");
      router.push("/profilepage");
    } catch (err) {
      setError(err.message || "Failed to save review");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-xl font-semibold text-[#D17368]">Loading cook mode...</p>;
  }

  if (!recipe) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 p-10 text-center">
        <p className="text-xl font-semibold text-red-600">{error}</p>
        <button onClick={() => router.push("/recipes")} className="rounded-xl bg-[#D17368] px-8 py-3 font-bold text-white">
          Choose a Recipe
        </button>
      </main>
    );
  }

  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];

  return (
    <main className="min-h-screen overflow-hidden px-6 py-10 md:px-12">
      <div className="mx-auto mb-8 max-w-5xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-bold uppercase tracking-[0.2em] text-[#D17368]">
            Cook Mode · {stepNames[step]}
          </p>
          <button onClick={cancelCookMode} className="cursor-pointer font-semibold text-[#D17368] underline">
            Cancel Cook Mode
          </button>
        </div>
        <div className="flex gap-2">
          {stepNames.map((name, index) => (
            <div key={name} className="flex-1">
              <div className={`h-2 rounded-full transition-colors duration-500 ${index <= step ? "bg-[#D17368]" : "bg-[#E7DEDB]"}`} />
              <span className="mt-2 hidden text-xs font-semibold text-[#D17368] sm:block">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl overflow-hidden">
        <div
          className={`flex items-start transition-transform duration-700 ${direction === "forward" ? "ease-out" : "ease-in-out"}`}
          style={{ width: "400%", transform: `translateX(-${step * 25}%)` }}
        >
          <section className="w-1/4 shrink-0 px-1">
            <div className="overflow-hidden rounded-3xl border-4 border-[#D17368] bg-white shadow-xl">
              <div className="grid md:grid-cols-2">
                <div className="h-80 md:h-[520px]">
                  <img
                    src={recipe.image ? `data:image/png;base64,${recipe.image}` : "/black.png"}
                    alt={recipe.recipeName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <h1 className="text-5xl font-bold text-[#D17368]">{recipe.recipeName}</h1>
                  <p className="mt-6 text-lg leading-8 text-gray-700">{recipe.description}</p>
                  <p className="mt-10 text-4xl font-bold text-[#D17368]">Ready?</p>
                  <div className="mt-6 flex gap-4">
                    <button onClick={() => moveTo(1)} className="flex-1 rounded-xl bg-[#D17368] px-6 py-4 text-lg font-bold text-white transition hover:bg-[#b5645b]">
                      Get Cooking
                    </button>
                    <button onClick={cancelCookMode} className="flex-1 rounded-xl bg-[#E7DEDB] px-6 py-4 text-lg font-bold text-[#D17368] transition hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-1/4 shrink-0 px-1">
            <div className="rounded-3xl border-4 border-[#D17368] bg-white p-8 shadow-xl md:p-12">
              <h1 className="text-5xl font-bold text-[#D17368]">Gather Your Ingredients</h1>
              <p className="mt-3 text-gray-600">Adjust the recipe amount, then check off each ingredient as you gather it.</p>

              <div className="my-8 inline-flex rounded-xl bg-[#E7DEDB] p-1">
                {[[0.5, "Half"], [1, "Original"], [2, "Double"]].map(([amount, label]) => (
                  <button
                    key={label}
                    onClick={() => setScale(amount)}
                    className={`rounded-lg px-5 py-2 font-bold transition ${scale === amount ? "bg-[#D17368] text-white" : "text-[#D17368] hover:bg-white/70"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {ingredients.length ? ingredients.map((ingredient, index) => {
                  const isString = typeof ingredient === "string";
                  const label = isString
                    ? ingredient
                    : `${scaledQuantity(ingredient.quantity, scale)} ${ingredient.measurement} ${ingredient.name}`;
                  return (
                    <label key={index} className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition ${checkedIngredients.includes(index) ? "border-[#F5BAA7] bg-[#FFF2DF] text-gray-400 line-through" : "border-[#E7DEDB] text-gray-700 hover:border-[#F5BAA7]"}`}>
                      <input
                        type="checkbox"
                        checked={checkedIngredients.includes(index)}
                        onChange={() => toggleChecked(setCheckedIngredients, index)}
                        className="h-6 w-6 accent-[#D17368]"
                      />
                      <span className="text-lg">{label}</span>
                    </label>
                  );
                }) : <p className="italic text-gray-500">No ingredients were added to this recipe.</p>}
              </div>

              <div className="mt-10 flex gap-4">
                <button onClick={() => moveTo(0)} className="flex-1 rounded-xl bg-[#E7DEDB] py-3 font-bold text-[#D17368] hover:bg-gray-300">Back</button>
                <button onClick={() => moveTo(2)} className="flex-1 rounded-xl bg-[#D17368] py-3 font-bold text-white hover:bg-[#b5645b]">Next: Instructions</button>
              </div>
            </div>
          </section>

          <section className="w-1/4 shrink-0 px-1">
            <div className="rounded-3xl border-4 border-[#D17368] bg-white p-8 shadow-xl md:p-12">
              <h1 className="text-5xl font-bold text-[#D17368]">Follow the Instructions</h1>
              <p className="mt-3 text-gray-600">Check off each step as you complete it.</p>
              <div className="mt-8 space-y-3">
                {instructions.length ? instructions.map((instruction, index) => {
                  const text = typeof instruction === "string" ? instruction : instruction.step;
                  return (
                    <label key={index} className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition ${checkedInstructions.includes(index) ? "border-[#F5BAA7] bg-[#FFF2DF] text-gray-400 line-through" : "border-[#E7DEDB] text-gray-700 hover:border-[#F5BAA7]"}`}>
                      <input
                        type="checkbox"
                        checked={checkedInstructions.includes(index)}
                        onChange={() => toggleChecked(setCheckedInstructions, index)}
                        className="mt-1 h-6 w-6 shrink-0 accent-[#D17368]"
                      />
                      <span className="text-lg"><strong className="text-[#D17368]">Step {index + 1}:</strong> {text}</span>
                    </label>
                  );
                }) : <p className="italic text-gray-500">No instructions were added to this recipe.</p>}
              </div>
              <div className="mt-10 flex gap-4">
                <button onClick={() => moveTo(1)} className="flex-1 rounded-xl bg-[#E7DEDB] py-3 font-bold text-[#D17368] hover:bg-gray-300">Back</button>
                <button onClick={() => moveTo(3)} className="flex-1 rounded-xl bg-[#D17368] py-3 font-bold text-white hover:bg-[#b5645b]">Complete Cooking</button>
              </div>
            </div>
          </section>

          <section className="w-1/4 shrink-0 px-1">
            <div className="rounded-3xl border-4 border-[#D17368] bg-white p-8 shadow-xl md:p-12">
              <div className="text-center">
                <p className="text-6xl">🎉</p>
                <h1 className="mt-3 text-5xl font-bold text-[#D17368]">Cooking Complete!</h1>
                <p className="mt-3 text-lg text-gray-600">How did your {recipe.recipeName} turn out?</p>
              </div>

              {error && <p className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">{error}</p>}

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold text-[#D17368]">Your Review</label>
                  <textarea
                    rows={8}
                    value={review}
                    onChange={(event) => setReview(event.target.value)}
                    placeholder="Tell us about your dish..."
                    className="w-full resize-none rounded-xl border-2 border-[#D17368] bg-[#FFF2DF] p-4 text-[#4A2C2A] caret-[#D17368] placeholder:text-[#D17368]/50 focus:outline-none focus:ring-2 focus:ring-[#F5BAA7]"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-bold text-[#D17368]">Photo of Your Dish</label>
                  <label className="flex h-52 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#D17368] bg-[#FFF2DF] text-center text-[#D17368] hover:bg-[#F5BAA7]/30">
                    {dishPreview ? (
                      <img src={dishPreview} alt="Your completed dish" className="h-full w-full object-cover" />
                    ) : (
                      <span className="px-4 font-semibold">Click to upload a photo</span>
                    )}
                    <input type="file" accept="image/*" onChange={handleDishImage} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button onClick={() => moveTo(2)} disabled={submitting} className="flex-1 rounded-xl bg-[#E7DEDB] py-3 font-bold text-[#D17368] hover:bg-gray-300 disabled:opacity-50">Back</button>
                <button onClick={finishCookMode} disabled={submitting} className="flex-1 rounded-xl bg-[#D17368] py-3 font-bold text-white hover:bg-[#b5645b] disabled:opacity-50">
                  {submitting ? "Saving..." : "Save Review & Finish"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function Cook() {
  return (
    <Suspense fallback={<p className="p-10 text-xl font-semibold text-[#D17368]">Loading cook mode...</p>}>
      <CookFlow />
    </Suspense>
  );
}
