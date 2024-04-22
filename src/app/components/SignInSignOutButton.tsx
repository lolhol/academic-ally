import { useState } from "react";
import css from "./NavBar.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function SignInSignOutButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn(undefined, { callbackUrl: "/panel" })}>
      Sign In
    </button>
  );
}
