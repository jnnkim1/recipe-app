"use client";

export default function IngredientList({
  value = [{ name: "", quantity: "", measurement: "Cups" }],
  onChange = null,
}) {
  const measurements = ["Cups", "Tablespoons", "Teaspoons", "Grams", "Ounces"];
  const ingredients = value;

  const handleChange = (index, field, val) => {
    const sanitizedValue = field === "quantity"
      ? val.replace(/[^0-9./\s]/g, "")
      : val;
    const updated = ingredients.map((ingredient, ingredientIndex) =>
      ingredientIndex === index
        ? { ...ingredient, [field]: sanitizedValue }
        : ingredient
    );
    if (onChange) {
      onChange(updated);
    }
  };

  const addIngredient = () => {
    const updated = [...ingredients, { name: "", quantity: "", measurement: "Cups" }];
    if (onChange) {
      onChange(updated);
    }
  };

  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
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
            className="w-full bg-[#F5BAA7] text-[#4A2C2A] caret-[#D17368] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
            required
          />

          <input
            type="text"
            inputMode="text"
            pattern="\s*(?:\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\s*"
            title="Enter a whole number, decimal, fraction (3/4), or mixed fraction (1 1/2)"
            value={ingredient.quantity}
            onChange={(e) => handleChange(index, "quantity", e.target.value)}
            placeholder="Qty"
            className="w-34 bg-[#F5BAA7] text-[#4A2C2A] caret-[#D17368] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
            required
          />

          <select
            value={ingredient.measurement}
            onChange={(e) => handleChange(index, "measurement", e.target.value)}
            className="text-[#4A2C2A] w-40 bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
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
