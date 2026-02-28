"use client";

import React, { useState, type KeyboardEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import styles from "./styles/SecurityUsersSearchBar.module.css";

interface SecurityUsersSearchBarProps {
  onSearch: (query: string) => void;
}

export default function SecurityUsersSearchBar({
  onSearch,
}: Readonly<SecurityUsersSearchBarProps>) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleFilter = () => {
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchInputWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Busque por ID de asociado..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        type="button"
        className={styles.filterButton}
        onClick={handleFilter}
        title="Filtrar"
      >
        <SlidersHorizontal size={16} />
      </button>
    </div>
  );
}
