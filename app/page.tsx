import NavBar from "./components/NavBar";
import logo from '../public/black.png'
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex flex-row flex-grow p-8 gap-12 bg-[#FFF2DF]">
        <section className="w-1/2 flex justify-center items-center">
          <div className="w-full max-w-md aspect-square">
            <img className="w-full h-full object-fill" src="/black.png" alt="" />
          </div>
        </section>
        
        <section className="w-1/2 justify-center items-center flex flex-col">
          <h3 className="!text-[#D17368]">A Recipe Book for All Your Needs</h3>
          <h1 className="text-7xl font-bold text-[#D17368]">RECIPE BOOK</h1>
          <p className="mb-6">
            Discover a world of culinary delights with our Recipe Book app! Whether you're a seasoned chef or a kitchen novice, our app offers a diverse collection of recipes to suit every taste and occasion. From quick weeknight dinners to elaborate gourmet meals, find step-by-step instructions, ingredient lists, and cooking tips to help you create delicious dishes with ease.
          </p>
          <section className="flex flex-row flex-wrap justify-center items-center gap-10">
            <Link href="/register">
              <button className="bg-[#D17368] text-white font-semibold w-51 h-12 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer">
                Register
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-[#FFF2DF] text-[#D17368] font-semibold w-51 h-12 rounded-xl border-3 border-[#D17368] hover:bg-[#ffe8c7] transition duration-300 cursor-pointer">
                Login
              </button>
            </Link>
          </section>
        </section>

      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white text-center p-4">
        <small>© 2025 My React Site</small>
      </footer> */}
    </div>
  );
}