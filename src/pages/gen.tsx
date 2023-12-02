import DropdownMenu from "../components/DropdownMenu";
import Image from "next/image";
import Link from "../../node_modules/next/link";

import css from "../styles/genStyle.module.css";

export default function Gen() {
  return (
    <main>
      <Link href={""}>
        <div>
          <Image
            className={css.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          ></Image>
        </div>
      </Link>

      <div className={css.selectClass}>
        <DropdownMenu />
      </div>
    </main>
  );
}
