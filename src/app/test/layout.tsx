"use client";

import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import css from "./layout.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider refetchOnWindowFocus={false}>
          <div className={css["nav-bar-css"]}>
            <NavBar />
          </div>
          <div>{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
