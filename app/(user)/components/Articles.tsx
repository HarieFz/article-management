"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArticlesService } from "@/network/services/articles.service";
import formatDate from "@/utils/formatDate";
import SearchContext from "@/contexts/SearchContext";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SmartPagination from "@/components/SmartPagination";

export default function Articles() {
  const { values } = useContext(SearchContext);
  const search = useDebounce(values, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["articles", currentPage, search],
    queryFn: () =>
      ArticlesService.get({
        limit: 9,
        page: currentPage,
        category: search[0].category === "default" ? "" : search[0].category,
        title: search[0].title,
      }),
  });

  const totalPages = Math.ceil((data?.total ?? 0) / (data?.limit ?? 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <section className="max-w-8xl w-full mx-auto">
      <div id="articles" className="lg:mx-25 lg:mt-10 lg:mb-25 mx-5 pt-10 mb-15">
        {data?.limit && data?.total ? (
          <div className="mb-6">
            <p className="font-medium text-slate-600">
              Showing: {(currentPage - 1) * data.limit + 1} - {Math.min(currentPage * data.limit, data.total)} of{" "}
              {data.total} articles
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="font-medium text-slate-600">Showing: 0 of 0 articles</p>
          </div>
        )}

        <article className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-x-10 sm:gap-y-15 gap-10 md:mb-15 mb-6">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
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
            ))
          ) : data?.data?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
              <CircleHelp className="text-3xl text-slate-700 mb-2" />
              <p className="text-lg font-semibold text-slate-700">No articles found</p>
              <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            data?.data?.map((item, index) => (
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
                      className="lg:text-base text-sm text-slate-600 text-wrap line-clamp-2"
                    ></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-blue-200 rounded-[100px] px-3 py-1 w-fit">
                      <p className="lg:text-sm text-xs text-blue-900">{item.category.name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </article>

        <SmartPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </div>
    </section>
  );
}
