import React from "react";
import Sidebar from "./components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <Sidebar />
      <main className="w-[calc(100%-267px)] h-full bg-gray-100 ms-auto">{children}</main>
    </div>
  );
}
