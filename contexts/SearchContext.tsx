"use client";

import { createContext } from "react";

interface InitialSearch {
  category: string;
  title: string;
}

interface InitialContext {
  values: InitialSearch;
  setValues: React.Dispatch<React.SetStateAction<InitialSearch>>;
}

const initialContext: InitialContext = {
  values: { category: "", title: "" },
  setValues: () => {},
};

const SearchContext = createContext<InitialContext>(initialContext);

export default SearchContext;
export type { InitialSearch };
