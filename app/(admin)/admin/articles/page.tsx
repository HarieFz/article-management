"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { ArticlesService } from "@/network/services/articles.service";
import Image from "next/image";
import formatDate from "@/utils/formatDate";
import { CategoriesService } from "@/network/services/categories.service";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import SmartPagination from "@/components/SmartPagination";
import DialogDelete from "./components/DialogDelete";

export default function Articles() {
  const [queries, setQueries] = useState({
    category: "",
    title: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const search = useDebounce(queries, 500);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesService.get(),
  });

  const { data: articles, isLoading: isArticlesLoading } = useQuery({
    queryKey: ["articles", currentPage, search],
    queryFn: () =>
      ArticlesService.get({
        limit: 10,
        page: currentPage,
        category: search[0].category === "default" ? "" : search[0].category,
        title: search[0].title,
      }),
  });

  const totalPages = Math.ceil((articles?.total ?? 0) / (articles?.limit ?? 1));

  return (
    <div>
      <Header title="Articles" />

      <main className="max-w-8xl w-full mx-auto px-6 pt-6 pb-25">
        <div className="border border-slate-200 rounded-[12px] overflow-hidden">
          <div className="bg-gray-50 border-b border-slate-200 p-6">
            <p className="font-medium text-slate-800">Total Articles : {articles?.total}</p>
          </div>
          <div className="bg-gray-50 border-b border-slate-200 flex justify-between p-6">
            <div className="flex items-center gap-2">
              <Select
                defaultValue={queries.category}
                onValueChange={(value) => setQueries((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-fit min-w-27 bg-white !h-10 !text-slate-900 !font-medium">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {isCategoriesLoading ? (
                      <SelectItem value="default" disabled>
                        <Loader2Icon className="animate-spin" /> Loading
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="default">Category</SelectItem>

                        {categories?.data
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

              <div className="relative">
                <Input
                  type="text"
                  id="title"
                  placeholder="Search by title"
                  className="w-60 !border-slate-300 placeholder:text-slate-400 h-10 ps-9.5"
                  onChange={(e) => setQueries((prev) => ({ ...prev, title: e.target.value }))}
                />
                <Search size={20} className="text-slate-400 absolute top-2.5 left-3" />
              </div>
            </div>

            <div>
              <Button size="lg" className="w-[135px] text-sm bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="articles/add">
                  <Plus className="text-white" /> Add Articles
                </Link>
              </Button>
            </div>
          </div>

          <Table className="border-b">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[225px] text-center">Thumbnails</TableHead>
                <TableHead className="w-[225px] text-center">Title</TableHead>
                <TableHead className="w-[225px] text-center">Category</TableHead>
                <TableHead className="w-[225px] text-center">Created At</TableHead>
                <TableHead className="w-[225px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-50">
              {isArticlesLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-[225px] text-center py-3">
                      <Skeleton className="bg-slate-200 w-16 h-16  rounded mx-auto" />
                    </TableCell>
                    <TableCell className="w-[225px] text-sm ">
                      <Skeleton className="bg-slate-200 h-4  rounded mb-2" />
                      <Skeleton className="bg-slate-200 h-4 w-3/4  rounded" />
                    </TableCell>
                    <TableCell className="w-[225px] text-sm ">
                      <Skeleton className="bg-slate-200 h-4  rounded mx-auto w-2/3" />
                    </TableCell>
                    <TableCell className="w-[225px] text-sm ">
                      <Skeleton className="bg-slate-200 h-4  rounded mx-auto w-2/3" />
                    </TableCell>
                    <TableCell className="w-[225px] text-center">
                      <Skeleton className="bg-slate-200 h-4  rounded mx-auto w-1/2" />
                    </TableCell>
                  </TableRow>
                ))
              ) : articles?.data?.length === 0 ? (
                // Kosong
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500 text-sm italic">
                    No articles found.
                  </TableCell>
                </TableRow>
              ) : (
                articles?.data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-[225px] flex justify-center py-3">
                      {item?.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt="thumbnail"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-15 h-15 rounded-[6px] object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="w-[225px] max-w-[225px] text-center">
                      <p className="text-sm text-wrap line-clamp-2 text-slate-600">{item.title}</p>
                    </TableCell>
                    <TableCell className="w-[225px] text-center text-sm text-slate-600">{item.category.name}</TableCell>
                    <TableCell className="w-[225px] text-center text-sm text-slate-600">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="w-[225px] text-center">
                      <Button
                        variant="link"
                        className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
                        asChild
                      >
                        <Link href={`/preview/${item.id}`}>Preview</Link>
                      </Button>
                      <Button
                        variant="link"
                        className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
                        asChild
                      >
                        <Link href={`/admin/articles/edit/${item.id}`}>Edit</Link>
                      </Button>
                      <DialogDelete id={item.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="bg-gray-50 py-6">
            <SmartPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
          </div>
        </div>
      </main>
    </div>
  );
}
