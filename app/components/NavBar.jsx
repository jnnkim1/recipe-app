"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar({ title }) {
    const pathname = usePathname();

    // Define button sets per page
    let buttons = [];

    if (pathname === "/") {
        buttons = [
            { name: "Home", route: "/" },
            { name: "About", route: "/about" },
            { name: "Login", route: "/login" },
        ];
    } else if (pathname === "/about") {
        buttons = [
            { name: "Home", route: "/" },
            { name: "Recipes", route: "/recipes" },
            { name: "Login", route: "/login" },
        ];
    } else if (pathname === "/recipes") {
        buttons = [
            { name: "Home", route: "/" },
            { name: "About", route: "/about" },
            { name: "Login", route: "/login" },
        ];
    } else if (pathname === "/login") {
        buttons = [
            { name: "Home", route: "/" },
            { name: "About", route: "/about" },
            { name: "Recipes", route: "/recipes" },
        ];
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
                        <Link href={btn.route}>
                            <button
                                className={`text-white font-semibold p-2 ${btn.name === "Login" ? "w-20 h-12 bg-[#D17368] rounded hover:bg-[#b5645b] transition duration-300 cursor-pointer" : "w-20 h-12 rounded hover:bg-[#d99c89] transition duration-300 cursor-pointer"
                                    }`}
                            >
                                {btn.name}
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
