"use client";

import { useState } from "react";
import { BookOpen, ChefHat, Clipboard, ShoppingBasket } from "lucide-react";
import Card from "../components/Card";
import CookRecipeModal from "../components/CookRecipeModal";

export default function Profile() {
  const [isCookModalOpen, setIsCookModalOpen] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="mt-10 text-7xl font-bold text-[#D17368]">MY RECIPE BOOK</h1>
      <section className="flex flex-wrap items-center justify-center bg-[#FFF2DF] p-3">
        <Card icon={ShoppingBasket} title="CREATE NEW RECIPE" description="Create a new recipe." buttonText="Create" link="/newrecipeinfo" />
        <Card icon={BookOpen} title="VIEW ALL RECIPES" description="View all your recipes." buttonText="View" link="/recipes" />
        <Card icon={ChefHat} title="COOKING MODE" description="Step-by-step cooking instructions." buttonText="Cook" onClick={() => setIsCookModalOpen(true)} />
        <Card icon={Clipboard} title="COOKING LOG" description="See the dishes you have completed." buttonText="View Log" link="/cookhistory" />
      </section>

      <CookRecipeModal isOpen={isCookModalOpen} onClose={() => setIsCookModalOpen(false)} />
    </main>
  );
}
