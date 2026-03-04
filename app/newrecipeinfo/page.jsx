"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function newRecipe() {
    const router = useRouter();
    const { data: session } = useSession();
    const [recipeName, setRecipeName] = useState("");
    const [description, setDescription] = useState("");
    const [recipeImage, setRecipeImage] = useState(null);
    const fileInputRef = useRef(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!session) {
            setError("Please log in to create a recipe");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("recipeName", recipeName);
        formData.append("description", description);
        if (recipeImage) formData.append("recipeImage", recipeImage);

        try {
            const res = await fetch("/api/recipes", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                // Store the recipe ID and name in localStorage to use on next pages
                localStorage.setItem("currentRecipeId", data.insertedId);
                localStorage.setItem("currentRecipeName", data.recipeName);
                router.push("/newrecipeinfo/ingredients");
            } else {
                setError(data.error || "Failed to save recipe");
            }
        } catch (err) {
            setError("An error occurred while saving the recipe");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <h1 className="text-4xl font-bold text-[#D17368] mb-4">Please Log In</h1>
                <p className="text-lg text-gray-600 mb-6">You need to be logged in to create a recipe.</p>
                <Link href="/login" className="bg-[#D17368] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#b5645b] transition duration-300">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <h1 className="text-7xl font-bold text-[#D17368] mt-10 ml-10">CREATE A RECIPE</h1>
            <main className="">

                <form className="flex bg-[#FFF2DF] mt-10 items-start" onSubmit={handleSave}>
                    <section className="flex flex-col items-start pl-10">
                        <div className="w-110 aspect-square mt-2">
                            <img
                                className="w-full h-full object-cover rounded-xl"
                                src={recipeImage ? URL.createObjectURL(recipeImage) : "/black.png"}
                                alt=""
                            />
                        </div>

                        <div className="mt-4 flex justify-center gap-6 w-full">
                            <button type="button" onClick={() => fileInputRef.current.click()} className="text-[#D17368] font-semibold underline cursor-pointer">
                                Upload Image
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) => setRecipeImage(e.target.files[0])}
                            />

                            <button type="button" onClick={() => setRecipeImage(null)} className="text-[#D17368] font-semibold underline cursor-pointer">
                                Delete Image
                            </button>
                        </div>
                    </section>

                    <section className="flex flex-col justify-start mt-2 gap-4 flex-1 pr-10 ml-10">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex flex-col gap-1">
                            <label className="ml-3 font-bold text-[#D17368]">
                                Recipe Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter recipe name"
                                value={recipeName}
                                onChange={(e) => setRecipeName(e.target.value)}
                                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="ml-3 font-bold text-[#D17368]">
                                Description
                            </label>
                            <textarea
                                placeholder="Enter recipe description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 resize-none focus:ring-2 focus:ring-[#D17368] focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#D17368] mt-5 text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer w-1/3 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Saving..." : "Next: Add Ingredients"}
                        </button>

                    </section>
                </form>
            </main>
        </div>

    );
}
