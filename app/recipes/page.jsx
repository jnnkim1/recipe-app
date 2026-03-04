export default function Recipes() {
  return (
    <main className="flex flex-col justify-center items-center">
      <section className="w-1/2 justify-center items-center flex flex-col mt-10">
        <h1 className="text-7xl font-bold text-[#D17368]">ALL RECIPES</h1>
        <input
          type="Search"
          placeholder="Search for a recipe..."
          // value={username}
          // onChange={(e) => setUsername(e.target.value)}
          className="w-full
    text-[#D17368]
    placeholder:text-[#D17368]/60
    bg-[#E7DEDB]
    rounded-xl
    px-4
    py-3
    focus:ring-2
    focus:ring-[#D17368]
    focus:outline-none
    appearance-none"
        />
      </section>
    </main>
  );
}
