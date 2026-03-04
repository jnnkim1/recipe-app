"use client";

import { useState, useEffect } from "react";

export default function IngredientList({ value = null, onChange = null }) {
  const measurements = ["Cups", "Tablespoons", "Teaspoons", "Grams", "Ounces"];

  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", measurement: "Cups" },
  ]);

  useEffect(() => {
    if (value) {
      setIngredients(value);
    }
  }, [value]);

  const handleChange = (index, field, val) => {
    const updated = [...ingredients];
    updated[index][field] = val;
    setIngredients(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const addIngredient = () => {
    const updated = [...ingredients, { name: "", quantity: "", measurement: "Cups" }];
    setIngredients(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-4 items-center">
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            placeholder="Ingredient name"
            className="w-full bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
            required
          />

          <input
            type="text"
            value={ingredient.quantity}
            onChange={(e) => handleChange(index, "quantity", e.target.value)}
            placeholder="Qty"
            className="w-34 bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
            required
          />

          <select
            value={ingredient.measurement}
            onChange={(e) => handleChange(index, "measurement", e.target.value)}
            className="text-white w-40 bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
          >
            {measurements.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {ingredients.length > 1 && (
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-red-500 font-semibold"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addIngredient}
        className="self-start text-[#D17368] font-semibold underline mt-2 ml-2 cursor-pointer"
      >
        + Add Ingredient
      </button>
    </div>
  );
}
