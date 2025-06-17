"use client";

import AccountMenu from "@/components/AccountMenu";
import { AuthService } from "@/network/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../../public/images/logo-v1.png";
import Footer from "../components/Footer";
import { getFirstLetter } from "@/utils/getFirstLetter";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { Skeleton } from "@/components/ui/skeleton";
import { decrypt } from "@/lib/crypto";

export default function Profile() {
  const cookie = getCookie("password");
  const session = decrypt(cookie);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => AuthService.profile(),
  });

  return (
    <div className="h-dvh flex flex-col justify-between">
      <header className="bg-white sm:px-15 sm:py-9 px-5 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between lg:max-w-8xl w-full mx-auto">
          <Link href="/">
            <Image src={Logo} alt="Logo" width={0} height={0} className="w-[134px] h-6" />
          </Link>

          <AccountMenu />
        </div>
      </header>

      <main className="max-w-8xl w-full mx-auto flex justify-center">
        <div className="w-[400px] flex flex-col items-center justify-center px-4 py-6">
          <p className="font-semibold text-xl text-slate-900 mb-9">User Profile</p>
          {isLoading ? (
            <Skeleton className="w-17 h-17 rounded-full mb-6" />
          ) : (
            <div className="bg-blue-200 w-17 h-17 rounded-full flex items-center justify-center mb-6">
              <p>{getFirstLetter(data?.username)}</p>
            </div>
          )}

          <div className="w-full flex flex-col gap-3 mb-9">
            {isLoading ? (
              <>
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </>
            ) : (
              <>
                <div className="w-full bg-gray-100 rounded-[6px] border border-slate-200 flex items-center justify-between gap-9 px-3 py-2.5">
                  <div className="w-[97px] shrink-0 flex items-center justify-between text-gray-900">
                    <p className="font-bold">Username</p>
                    <p>:</p>
                  </div>
                  <div className="w-full">
                    <p className="text-center text-slate-900">{data?.username}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-[6px] border border-slate-200 flex items-center justify-between gap-9 px-3 py-2.5">
                  <div className="w-[97px] shrink-0 flex items-center justify-between text-gray-900">
                    <p className="font-bold">Password</p>
                    <p>:</p>
                  </div>
                  <div className="w-full">
                    <p className="text-center text-slate-900">{session.password}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-[6px] border border-slate-200 flex items-center justify-between gap-9 px-3 py-2.5">
                  <div className="w-[97px] shrink-0 flex items-center justify-between text-gray-900">
                    <p className="font-bold">Role</p>
                    <p>:</p>
                  </div>
                  <div className="w-full">
                    <p className="text-center text-slate-900">{data?.role}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button className="w-full h-10 bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
