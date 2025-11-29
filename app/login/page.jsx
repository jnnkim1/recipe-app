export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex flex-col justify-center items-center">
        <section className="w-1/2 justify-center items-center flex flex-col mt-15">
          <h1 className="text-7xl font-bold text-[#D17368]">LOGIN</h1>
          {/* <section> */}
          <form className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-5">
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">Userame</label>
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
              Login
            </button>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span>Don't have an account? </span>
              <a
                href="/register"
                className="text-[#D17368] font-semibold underline cursor-pointer"
              >
                Register here
              </a>
            </div>
          </form>
        </section>
        {/* <section className="flex flex-row flex-wrap justify-center items-center gap-10">
          </section> */}
        {/* </section> */}
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white text-center p-4">
            <small>© 2025 My React Site</small>
          </footer> */}
    </div>
  );
}
