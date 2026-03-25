// src/app/layout.js
import "../styles/globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from "../context/authContext";
import MyState from "../context/myState";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rentnama",
  description: "Your rental clothing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MyState>{children}</MyState>
        </AuthProvider>
      </body>
    </html>
  );
}
