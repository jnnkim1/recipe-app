import Card from "../components/Card";
import Link from "next/link";

export default function Profile() {
  return (
    <main className="flex flex-col justify-center items-center">
      <h1 className="text-7xl font-bold text-[#D17368] mt-10">MY RECIPE BOOK</h1>
      <section className="flex flex-wrap justify-center items-center p-3 bg-[#FFF2DF]">
      <Card image="black.png" title="CREATE NEW RECIPE" description="This is a sample description of the recipe." buttonText="Create" link="/newrecipeinfo"/>
      <Card image="black.png" title="VIEW ALL RECIPES" description="This is a sample description of the recipe." buttonText="View" link="/recipe"/>
      <Card image="black.png" title="COOKING MODE" description="This is a sample description of the recipe." buttonText="Cook" link="cookmode"/>
      </section>
    </main>
  );
}
