import "./globals.css";
import type { ReactNode } from "react";
import NavBar from "./components/NavBar";  // make sure the path is correct
import { Providers } from "./providers";

export const metadata = {
  title: "Recipe Book App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar title="Recipe Book App" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
