"use client";

import { LogOut, Newspaper, Tag } from "lucide-react";
import Image from "next/image";
import Logo from "../../../public/images/logo-v2.png";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("token");
    router.push("/login");
  };

  return (
    <aside className="w-[267px] bg-blue-600 py-6 h-dvh fixed inset-0">
      <div className="mb-6">
        <Image
          src={Logo}
          alt="Logo"
          width={0}
          height={0}
          sizes="100vw"
          className="w-[134px] h-6 ms-8 my-1.5"
          priority
        />
      </div>

      <nav className="px-4">
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/admin/articles"
              className={`w-full h-10 rounded-[6px] flex items-center px-4 hover:bg-blue-500 ${
                pathname.startsWith("/admin/articles") && "bg-blue-500"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                <Newspaper size={20} />
                Articles
              </div>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/categories"
              className={`w-full h-10 rounded-[6px] flex items-center px-4 hover:bg-blue-500 ${
                pathname.startsWith("/admin/categories") && "bg-blue-500"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                <Tag size={20} />
                Category
              </div>
            </Link>
          </li>
          <li>
            <Dialog>
              <DialogTrigger className="w-full h-10 hover:bg-blue-500 rounded-[6px] flex items-center px-4 cursor-pointer">
                <div className="flex items-center gap-3 text-white">
                  <LogOut size={20} />
                  Logout
                </div>
              </DialogTrigger>

              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle className="font-semibold text-lg text-slate-900">Logout</DialogTitle>
                  <DialogDescription className="text-sm text-slate-500">Are you sure want to logout?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="h-10 !px-4 !py-2.5">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button className="bg-blue-600 hover:bg-blue-700 h-10 !px-4 !py-2.5" onClick={() => handleLogout()}>
                    Logout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
