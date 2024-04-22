"use client";

import { useState } from "react";
import css from "./NavBar.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import SignInSignOutButton from "./SignInSignOutButton";

export default function NavBar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className={css["nav-bar-css"]}>
      <img className={css["nav-bar-image"]} src="/logoNoText.jpeg" />
      <a className={css["nav-bar-text"]}>Academic Ally</a>
      <div className={css["sign-in-button-top-div"]}>
        <SignInSignOutButton />
      </div>
    </div>
  );
}
