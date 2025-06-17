"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthService } from "@/network/services/auth.service";
import { getFirstLetter } from "@/utils/getFirstLetter";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import Link from "next/link";
import React from "react";
import Header from "../../components/Header";
import { decrypt } from "@/lib/crypto";

export default function Profile() {
  const cookie = getCookie("password");
  const session = decrypt(cookie);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => AuthService.profile(),
  });

  return (
    <>
      <Header title="User Profile" />
      <main className="bg-gray-50 max-w-8xl w-full mx-auto h-dvh flex justify-center pt-6">
        <div className="w-[400px] flex flex-col items-center px-4 py-6">
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
                    <p className="text-center text-slate-900">{session.password ?? ""}</p>
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
            <Link href="/admin/articles">Back to dashboard</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
