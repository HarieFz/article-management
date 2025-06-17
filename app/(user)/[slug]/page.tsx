"use client";

import Image from "next/image";
import React, { use } from "react";
import LogoV1 from "../../../public/images/logo-v1.png";
import { ArticlesService } from "@/network/services/articles.service";
import { useQuery } from "@tanstack/react-query";
import formatDate from "@/utils/formatDate";
import Link from "next/link";
import Footer from "../components/Footer";
import AccountMenu from "@/components/AccountMenu";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailArticles({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use<{ slug: string }>(params);

  const { data, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => ArticlesService.getByID({ id: slug }),
  });

  const { data: articles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["articles", data?.categoryId],
    queryFn: () => ArticlesService.get({ limit: 3, category: data?.categoryId }),
  });

  return (
    <div>
      <header className="bg-white sm:px-15 sm:py-9 px-5 py-4 mb-10 border-b border-slate-200">
        <div className="flex items-center justify-between lg:max-w-8xl w-full mx-auto">
          <Link href="/">
            <Image src={LogoV1} alt="Logo" width={0} height={0} className="w-[134px] h-6" />
          </Link>

          <AccountMenu />
        </div>
      </header>

      <main className="max-w-8xl w-full mx-auto">
        <div className="flex flex-col items-center justify-center lg:mx-40 mx-5">
          {isLoading ? (
            <>
              <Skeleton className="w-full h-4 mb-4" />

              <Skeleton className="w-full h-6 lg:mb-10 mb-6" />

              <div className="max-w-[1120px] w-full aspect-[1120/480] mb-10">
                <Skeleton className="w-full h-full" />
              </div>

              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-full h-4 mb-2" />
              <Skeleton className="w-full h-4 mb-10" />
            </>
          ) : (
            <>
              <p className="font-medium text-sm text-slate-600 flex items-center gap-3 mb-4">
                <span>{formatDate(data?.createdAt ?? "")}</span>
                <span>•</span>
                <span>Created by {data?.user.username}</span>
              </p>

              <p className="max-w-[642px] font-semibold lg:text-3xl text-2xl text-center lg:mb-10 mb-6">
                {data?.title}
              </p>

              <div className="max-w-[1120px] w-full aspect-[1120/480] mb-10">
                {data?.imageUrl && (
                  <Image
                    src={data?.imageUrl}
                    alt="Thumbnail"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover rounded-[12px]"
                  />
                )}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: data?.content ?? "" }}
                className="lg:text-base text-sm mb-10"
              ></div>
            </>
          )}

          {isLoadingArticles ? (
            <div className="w-full lg:mx-5 mt-10 lg:mb-25 mb-10">
              <Skeleton className="w-1/6 h-6 mb-6" />
              <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-10 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="max-sm:max-w-[335px] max-sm:w-full max-sm:mx-auto hover:bg-white">
                    <div className="sm:max-w-[386.67] sm:aspect-[386.67/240] max-w-[335px] aspect-[335/200] mb-4">
                      <Skeleton className="w-full h-full object-cover" />
                    </div>

                    <div className="lg:h-[176px] flex flex-col lg:justify-between gap-2">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="w-1/2 h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                      </div>
                      <div className="px-3 py-1">
                        <Skeleton className="w-1/2 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : articles?.data?.length === 0 ? null : (
            <div className="lg:mx-5 mt-10 lg:mb-25 mb-10">
              <p className="font-bold text-xl mb-6">Other articles</p>
              <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-10 gap-6">
                {articles?.data
                  ?.filter((val) => val.id !== data?.id)
                  ?.map((item, index) => (
                    <Link
                      href={`/${item.id}`}
                      key={index}
                      className="max-sm:max-w-[335px] max-sm:w-full max-sm:mx-auto hover:bg-white rounded-[12px]"
                    >
                      <div className="sm:max-w-[386.67] sm:aspect-[386.67/240] max-w-[335px] aspect-[335/200] mb-4">
                        {item?.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt="Thumbnail"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full object-cover rounded-[12px]"
                          />
                        )}
                      </div>

                      <div className="lg:h-[176px] flex flex-col lg:justify-between gap-2">
                        <div className="flex flex-col gap-2">
                          <p className="lg:text-sm text-xs text-slate-600">{formatDate(item.createdAt)}</p>
                          <p className="font-semibold lg:text-lg text-base text-slate-900">{item.title}</p>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.content }}
                            className="lg:text-base text-sm text-slate-600 line-clamp-2"
                          ></div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="bg-blue-200 rounded-[100px] px-3 py-1 w-fit">
                            <p className="lg:text-sm text-xs text-blue-900">{item.category.name}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
