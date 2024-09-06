import React, { createContext, useContext, useEffect, useState } from "react";

const SearchListContext = createContext();

export function SearchListProvider({ children }) {
  const [searchListsArray, setSearchListsArray] = useState([]);

  return (
    <SearchListContext.Provider
      value={{ searchListsArray, setSearchListsArray }}
    >
      {children}
    </SearchListContext.Provider>
  );
}

export function useSearchList() {
  const context = useContext(SearchListContext);
  if (context === undefined) {
    throw new Error("useSearchList must be used within a SearchListProvider");
  }
  return context;
}
