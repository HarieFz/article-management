"use client";

import React, { useMemo, useState } from "react";
import Header from "../../components/Header";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import formatDate from "@/utils/formatDate";
import { CategoriesService } from "@/network/services/categories.service";
import { Skeleton } from "@/components/ui/skeleton";
import SmartPagination from "@/components/SmartPagination";
import DialogAdd from "./components/DialogAdd";
import DialogEdit from "./components/DialogEdit";
import DialogDelete from "./components/DialogDelete";

export default function Categories() {
  const [queries, setQueries] = useState({
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const search = useDebounce(queries, 500);

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories", currentPage, search],
    queryFn: () => CategoriesService.get(),
  });

  const filteredCategories = useMemo(() => {
    if (!categories?.data) return [];

    return [...categories.data]
      .filter((item) => item.name.toLowerCase().includes(search[0].name.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [categories, search]);

  const itemsPerPage = 10;

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div>
      <Header title="Category" />

      <main className="max-w-8xl w-full mx-auto px-6 pt-6 pb-25">
        <div className="border border-slate-200 rounded-[12px] overflow-hidden">
          <div className="bg-gray-50 border-b border-slate-200 p-6">
            <p className="font-medium text-slate-800">Total Category : {categories?.totalData}</p>
          </div>
          <div className="bg-gray-50 border-b border-slate-200 flex justify-between p-6">
            <div className="relative">
              <Input
                type="text"
                id="name"
                placeholder="Search Category"
                className="w-60 !border-slate-300 placeholder:text-slate-400 h-10 ps-9.5"
                onChange={(e) => setQueries((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Search size={20} className="text-slate-400 absolute top-2.5 left-3" />
            </div>

            <div>
              <DialogAdd />
            </div>
          </div>

          <Table className="border-b">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[225px] text-center">Category</TableHead>
                <TableHead className="w-[225px] text-center">Created At</TableHead>
                <TableHead className="w-[225px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-50">
              {isCategoriesLoading ? (
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
              ) : categories?.data?.length === 0 ? (
                // Kosong
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500 text-sm italic">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-[225px] max-w-[225px] text-center">
                      <p className="text-sm text-wrap line-clamp-2 text-slate-600">{item.name}</p>
                    </TableCell>
                    <TableCell className="w-[225px] text-center text-sm text-slate-600">
                      {formatDate(item.createdAt, true)}
                    </TableCell>
                    <TableCell className="w-[225px] text-center">
                      <DialogEdit id={item.id} name={item.name} />
                      <DialogDelete id={item.id} name={item.name} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="bg-gray-50 py-6">
            <SmartPagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages ?? 0} />
          </div>
        </div>
      </main>
    </div>
  );
}
