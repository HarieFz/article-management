import React from "react";
import Logo from "../../../public/images/logo-v2.png";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[#2563EB]/86 h-25 flex max-lg:flex-col items-center justify-center lg:gap-4 gap-2">
      <Image src={Logo} alt="Logo" className="w-[133.4px] h-6" />
      <p className="lg:text-base text-sm text-white">© 2025 Blog genzet. All rights reserved.</p>
    </footer>
  );
}
