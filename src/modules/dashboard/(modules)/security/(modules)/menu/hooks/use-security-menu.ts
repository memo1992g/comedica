"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  MenuModuleI,
  MenuTableRowI,
  CreateModulePayloadI,
  CreateCategoryPayloadI,
  CreateSubCategoryPayloadI,
  UpdateModulePayloadI,
  UpdateCategoryPayloadI,
} from "@/interfaces/security";
import { MENU_MODULES_MOCK } from "@/consts/menu/menu.consts";
import { buildTableRows } from "../utils/build-table-rows";

const PAGE_SIZE = 10;

interface DateRangeFilter {
  from: Date | null;
  to: Date | null;
}

export function useSecurityMenu() {
  const [modules, setModules] = useState<MenuModuleI[]>(MENU_MODULES_MOCK);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedSubCats, setExpandedSubCats] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeFilter>({ from: null, to: null });

  const [createOpen, setCreateOpen] = useState(false);
  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<MenuModuleI | null>(null);
  const [selectedRow, setSelectedRow] = useState<MenuTableRowI | null>(null);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    const q = searchQuery.toLowerCase();
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.categories.some(
          (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
        ) ||
        m.subCategories.some((s) => s.name.toLowerCase().includes(q)),
    );
  }, [modules, searchQuery]);

  const tableRows = useMemo(
    () => buildTableRows(filteredModules, expandedModules, expandedSubCats),
    [filteredModules, expandedModules, expandedSubCats],
  );

  const totalItems = tableRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const rows = tableRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }, []);

  const toggleSubCategory = useCallback((subCatId: string) => {
    setExpandedSubCats((prev) => {
      const next = new Set(prev);
      if (next.has(subCatId)) next.delete(subCatId);
      else next.add(subCatId);
      return next;
    });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleDateFilter = useCallback((range: DateRangeFilter) => {
    setDateRange(range);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  const openEditModule = useCallback(
    (moduleId: string) => {
      const mod = modules.find((m) => m.id === moduleId);
      if (mod) {
        setSelectedModule(mod);
        setEditModuleOpen(true);
      }
    },
    [modules],
  );

  const openEditItem = useCallback(
    (row: MenuTableRowI) => {
      setSelectedRow(row);
      setEditItemOpen(true);
    },
    [],
  );

  const handleCreateModule = useCallback((data: CreateModulePayloadI) => {
    const newMod: MenuModuleI = {
      id: `mod-${Date.now()}`,
      name: data.name,
      description: data.description,
      iconSvg: data.iconSvg,
      route: `/${data.name.toLowerCase().replace(/\s+/g, "-")}`,
      order: data.order,
      status: data.status,
      categories: [],
      subCategories: [],
    };
    setModules((prev) => [...prev, newMod]);
  }, []);

  const handleCreateCategory = useCallback((data: CreateCategoryPayloadI) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === data.moduleId
          ? {
              ...m,
              categories: [
                ...m.categories,
                {
                  id: `cat-${Date.now()}`,
                  moduleId: data.moduleId,
                  name: data.name,
                  description: data.description,
                  route: data.route,
                  order: data.order,
                  status: data.status,
                },
              ],
            }
          : m,
      ),
    );
  }, []);

  const handleCreateSubCategory = useCallback((data: CreateSubCategoryPayloadI) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== data.moduleId) return m;
        const subCatId = `subcat-${Date.now()}`;
        const selectedMenuIds = new Set(data.menuIds);
        const updatedCategories = m.categories.map((c) =>
          data.menuIds.includes(c.id) ? { ...c, subCategoryId: subCatId } : c,
        );
        const updatedSubCategories = m.subCategories.map((subCategory) => ({
          ...subCategory,
          menuIds: subCategory.menuIds.filter((menuId) => !selectedMenuIds.has(menuId)),
        }));
        return {
          ...m,
          categories: updatedCategories,
          subCategories: [
            ...updatedSubCategories,
            {
              id: subCatId,
              moduleId: data.moduleId,
              name: data.name,
              description: data.description,
              order: data.order,
              status: data.status,
              menuIds: data.menuIds,
            },
          ],
        };
      }),
    );
  }, []);

  const handleUpdateModule = useCallback((moduleId: string, data: UpdateModulePayloadI) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, name: data.name, description: data.description, iconSvg: data.iconSvg, route: data.route, order: data.order, status: data.status }
          : m,
      ),
    );
  }, []);

  const handleUpdateCategory = useCallback((categoryId: string, data: UpdateCategoryPayloadI) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        categories: m.categories.map((c) =>
          c.id === categoryId
            ? { ...c, name: data.name, description: data.description, route: data.route, order: data.order, status: data.status, moduleId: data.moduleId, subCategoryId: data.subCategoryId }
            : c,
        ),
      })),
    );
  }, []);

  return {
    modules,
    rows,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    searchQuery,
    dateRange,
    expandedModules,
    expandedSubCats,
    createOpen,
    setCreateOpen,
    editModuleOpen,
    setEditModuleOpen,
    editItemOpen,
    setEditItemOpen,
    selectedModule,
    selectedRow,
    toggleModule,
    toggleSubCategory,
    handleSearch,
    handleDateFilter,
    handlePageChange,
    handlePageSizeChange,
    openEditModule,
    openEditItem,
    handleCreateModule,
    handleCreateCategory,
    handleCreateSubCategory,
    handleUpdateModule,
    handleUpdateCategory,
  };
}
