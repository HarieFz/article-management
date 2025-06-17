"use client";

import Image from "next/image";
import React, { useContext } from "react";
import LogoV1 from "../../../public/images/logo-v1.png";
import LogoV2 from "../../../public/images/logo-v2.png";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import SearchContext from "@/contexts/SearchContext";
import { useQuery } from "@tanstack/react-query";
import { CategoriesService } from "@/network/services/categories.service";
import AccountMenu from "@/components/AccountMenu";
import { Loader2Icon, Search } from "lucide-react";

export default function Hero() {
  const { values, setValues } = useContext(SearchContext);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesService.get(),
  });

  return (
    <section className="relative bg-[#2563EB]/86 sm:h-[500px] h-[624px]">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(/images/bg-hero.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="lg:max-w-8xl w-full mx-auto">
        <header className="max-sm:bg-white flex items-center justify-between sm:px-15 sm:py-9 px-5 py-4 sm:mb-[42.5px] mb-[117px]">
          <div className="sm:block hidden">
            <Image src={LogoV2} alt="Logo" width={0} height={0} className="w-[134px] h-6" />
          </div>
          <div className="sm:hidden block">
            <Image src={LogoV1} alt="Logo" width={0} height={0} className="w-[122px] h-5.5" />
          </div>

          <AccountMenu textColor="white" />
        </header>

        <div className="sm:max-w-[720px] max-w-full w-full mx-auto max-sm:px-5">
          <div className="flex flex-col items-center gap-3 mb-10">
            <p className="font-bold lg:text-base text-sm text-white">Blog genzet</p>
            <p className="font-medium lg:text-5xl text-4xl text-center text-white">
              The Journal : Design Resources, Interviews, and Industry News
            </p>
            <p className="lg:text-2xl text-xl text-white">Your daily dose of design insights!</p>
          </div>

          <div className="bg-blue-500 md:w-fit w-full mx-auto rounded-[12px] p-2.5 flex max-md:flex-col items-center gap-2">
            <div className="md:w-[180px] w-full shrink-0 flex md:flex-col gap-1">
              <Select
                defaultValue={values.category}
                onValueChange={(value) => setValues((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-full bg-white !h-10">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {isLoading ? (
                      <SelectItem value="default" disabled>
                        <Loader2Icon className="animate-spin" /> Loading
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="default">Select Category</SelectItem>

                        {data?.data
                          ?.filter((item) => item.id && item.id.trim() !== "")
                          ?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="relative md:w-[400px] w-full shrink-0">
              <Input
                type="text"
                id="articles"
                placeholder="Search articles"
                className="bg-white h-10 ps-9.5"
                onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
              />
              <Search size={20} className="text-slate-400 absolute top-2.5 left-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
