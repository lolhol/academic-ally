"use client";

export default function NavBar() {
  return (
    <div className={"w-full flex justify-between items-center"}>
      <div className="cursor-pointer">
        <a className="text-4xl text-black-pearl font-extrabold font-inter">
          Cogniture
        </a>
      </div>
      <div className="flex justify-evenly flex-grow font-roboto text-black text-2xl font-bold">
        <a className="cursor-pointer">Product</a>
        <a className="cursor-pointer">Features</a>
        <a className="cursor-pointer">Benefits</a>
      </div>
      <div className="w-36 h-14">
        <button className="w-36 h-14 bg-yellow-button border-2 border-black rounded-lg font-roboto font-black text-2xl shadow-lg shadow-black shadow-solid">
          Sign In
        </button>
      </div>
    </div>
  );
}
