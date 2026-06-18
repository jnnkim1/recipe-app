export default function RecipeCard({ recipe, onViewRecipe }) {
  return (
    <div
      onClick={() => onViewRecipe(recipe)}
      className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-6 w-[280px] cursor-pointer hover:shadow-xl transition-shadow duration-300 border-2 border-[#E7DEDB]"
    >
      <div className="w-full h-[250px] overflow-hidden mb-4 rounded-xl">
        <img
          src={recipe.image ? `data:image/png;base64,${recipe.image}` : "/black.png"}
          alt={recipe.recipeName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-[#D17368] mb-2">{recipe.recipeName}</h2>
        <p className="text-gray-600 text-sm line-clamp-3">{recipe.description}</p>
      </div>
      <div className="w-full mt-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewRecipe(recipe);
          }}
          className="flex-1 bg-[#D17368] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#b5645b] transition duration-300 cursor-pointer"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}
