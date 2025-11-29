export default function Register() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex flex-col justify-center items-center">
        <section className="w-1/2 justify-center items-center flex flex-col mt-15">
          <h1 className="text-7xl font-bold text-[#D17368]">REGISTER</h1>
          {/* <section> */}
          <form className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-5">
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">First Name</label>
              <input
                type="Name"
                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 transition duration-300 focus:opacity-80 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">Username</label>
              <input
                type="Username"
                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 transition duration-300 focus:opacity-80 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">Password</label>
              <input
                type="Password"
                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 transition duration-300 focus:opacity-80 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
              />
            </div>

            <button className="bg-[#D17368] mt-5 text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer">
              Register
            </button>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span>Already have an account? </span>
              <a
                href="/login"
                className="text-[#D17368] font-semibold underline cursor-pointer"
              >
                Login here
              </a>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
