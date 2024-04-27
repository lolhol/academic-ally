import Image from "next/image";
import Link from "../../node_modules/next/link";
import css from "./page.module.css";
import cx from "classnames";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className="w-lvw h-lvh">
        <div className="ml-36 flex items-center h-full">
          <div className={cx("overflow-auto", css["animate-slideInFromTop"])}>
            <a
              className={cx(
                "font-black text-9xl bg-gradient-to-t from-slate-500 to-slate-100 text-transparent bg-clip-text leading-normal",
                inter.className
              )}
            >
              Cogniture
            </a>

            <a
              className={cx(
                "max-w-screen-sm leading-normal mt-5 block bg-gradient-to-t from-slate-400 to-slate-200 text-transparent bg-clip-text text-4xl whitespace-normal text-center"
              )}
            >
              something
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
