import "./globals.css";
import type { ReactNode } from "react";
import NavBar from "./components/NavBar";  // make sure the path is correct

export const metadata = {
  title: "Recipe Book App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar title="Recipe Book App" />
      {children}</body>
    </html>
  );
}
