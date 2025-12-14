"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Registration successful! Redirecting to login...");
      // Optional: redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex flex-col justify-center items-center">
        <section className="w-1/2 justify-center items-center flex flex-col mt-15">
          <h1 className="text-7xl font-bold text-[#D17368]">REGISTER</h1>
          <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">First Name</label>
              <input
                type="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 transition duration-300 focus:opacity-80 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="mt-1 ml-3 font-bold text-[#D17368]">Username</label>
              <input
                type="Username"
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
                type="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#F5BAA7] rounded-xl border-2 border-[#D17368] px-4 py-3 transition duration-300 focus:opacity-80 focus:ring-2 focus:ring-[#D17368] focus:outline-none"
                required
              />
            </div>

            <button type="submit" className="bg-[#D17368] mt-5 text-white font-semibold py-3 rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer">
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
