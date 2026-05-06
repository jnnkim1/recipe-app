"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function NavBar({ title }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    const handleLogout = async () => {
        const response = await fetch("/api/logout", { method: "POST" });
        if (response.ok) {
            await signOut({ redirect: true, callbackUrl: "/" });
        } else {
            console.error("Logout failed");
        }
    };

    let buttons = [];

    if (pathname === "/") {
        buttons = [
            { name: "Home", route: "/" },
            { name: "About", route: "/about" },
            { name: "Login", route: "/login" },
        ];
    } else if (pathname === "/profilepage") {
        buttons = [
            { name: "Recipes", route: "/recipes" },
            { name: "Cook", route: "/cook" },
        ];
        if (isAuthenticated) {
            buttons.push({ name: "Logout", action: handleLogout });
        }
    } else if (pathname === "/register") {
        buttons = [
            { name: "Home", route: "/" },
            { name: "About", route: "/about" },
            { name: "Login", route: "/login" },
        ];
    } else if (pathname === "/login") {
        buttons = [
            { name: "Home", route: "/" },
            { name: "About", route: "/about" },
            { name: "Register", route: "/register" },
        ];
    } else if (pathname === "/recipes") {
        buttons = [
            { name: "Home", route: "/profilepage" },
            { name: "Cook", route: "/cook" },
        ];
        if (isAuthenticated) {
            buttons.push({ name: "Logout", action: handleLogout });
        }
    } else if (pathname === "/cook") {
        buttons = [
            { name: "Home", route: "/profilepage" },
            { name: "Recipes", route: "/recipes" }
        ];
        if (isAuthenticated) {
            buttons.push({ name: "Logout", action: handleLogout });
        }
    } else {
        buttons = [
            { name: "Home", route: "/" },
            { name: "About", route: "/about" },
            { name: "Login", route: "/login" },
        ];
    }

    return (
        <div className="flex justify-between w-full bg-[#F5BAA7] items-center p-4">
            <div className="text-white font-bold text-xl">
                <Link href="/">
                    <button className="cursor-pointer">{title}</button>
                </Link>
            </div>
            <ul className="flex gap-6 list-none items-center">
                {buttons.map((btn) => (
                    <li key={btn.name}>
                        {btn.action ? (
                            <button
                                onClick={btn.action}
                                className={`text-white font-semibold p-2 ${(btn.name === "Login" || btn.name === "Register" || btn.name === "Logout") ? "w-22 h-12 bg-[#D17368] rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer" : "w-20 h-12 rounded-xl hover:bg-[#d99c89] transition duration-300 cursor-pointer"
                                    }`}
                            >
                                {btn.name}
                            </button>
                        ) : (
                            <Link href={btn.route}>
                                <button
                                    className={`text-white font-semibold p-2 ${(btn.name === "Login" || btn.name === "Register" || btn.name === "Logout") ? "w-22 h-12 bg-[#D17368] rounded-xl hover:bg-[#b5645b] transition duration-300 cursor-pointer" : "w-20 h-12 rounded-xl hover:bg-[#d99c89] transition duration-300 cursor-pointer"
                                        }`}
                                >
                                    {btn.name}
                                </button>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
