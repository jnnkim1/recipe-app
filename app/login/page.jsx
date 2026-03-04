"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/profilepage");
    } else {
      setError(result?.error || "Login failed");
    }
  };


  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex flex-col justify-center items-center">
        <section className="w-1/2 justify-center items-center flex flex-col mt-15">
          <h1 className="text-7xl font-bold text-[#D17368]">LOGIN</h1>
          {/* <section> */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 transition duration-300 focus:opacity-80 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 transition duration-300 focus:opacity-80 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
                required
              />
            </div>

            <button type="submit" disabled={loading}
              className="bg-[#D17368] mt-5 text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Logging in..." : "Login"}
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
