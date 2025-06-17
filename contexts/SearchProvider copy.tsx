"use client";

import React, { useState } from "react";
import SearchContext, { InitialSearch } from "./SearchContext";

export default function SearchProvider({ children }: { children: React.ReactNode }) {
  const [values, setValues] = useState<InitialSearch>({
    category: "",
    title: "",
  });

  return <SearchContext.Provider value={{ values, setValues }}>{children}</SearchContext.Provider>;
}
