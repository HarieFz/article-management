"use client";

import { AuthService } from "@/network/services/auth.service";
import { getFirstLetter } from "@/utils/getFirstLetter";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function Header({ title }: { title: string }) {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => AuthService.profile(),
  });

  return (
    <header className="bg-white px-6 pt-5 pb-4 mb-6 border-b border-slate-200">
      <div className="flex items-center justify-between w-full">
        <p className="font-semibold text-xl text-slate-900">{title}</p>

        <Link href="/admin/profile" className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-900">
            {getFirstLetter(data?.username)}
          </div>
          <p className="font-semibold `text-sm text-slate-900 underline underline-offset-3">{data?.username}</p>
        </Link>
      </div>
    </header>
  );
}
