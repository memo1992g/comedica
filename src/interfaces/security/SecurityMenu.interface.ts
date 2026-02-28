export type MenuStatusType = "Activo" | "Inactivo";

export interface MenuModuleI {
  id: string;
  name: string;
  description: string;
  iconSvg?: string;
  route: string;
  order: number;
  status: MenuStatusType;
  categories: MenuCategoryItemI[];
  subCategories: MenuSubCategoryI[];
}

export interface MenuCategoryItemI {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  route: string;
  order: number;
  status: MenuStatusType;
  subCategoryId?: string;
}

export interface MenuSubCategoryI {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  order: number;
  status: MenuStatusType;
  menuIds: string[];
}

export interface MenuTableRowI {
  id: string;
  rowType: "module" | "category-header" | "menu-item" | "sub-category" | "sub-item";
  name: string;
  description: string;
  route: string;
  order: number;
  status: MenuStatusType;
  parentModuleId?: string;
  subCategoryId?: string;
  childCount?: number;
  depth?: number;
}

export interface CreateModulePayloadI {
  name: string;
  description: string;
  iconSvg?: string;
  order: number;
  status: MenuStatusType;
}

export interface CreateCategoryPayloadI {
  moduleId: string;
  name: string;
  description: string;
  route: string;
  order: number;
  status: MenuStatusType;
}

export interface CreateSubCategoryPayloadI {
  moduleId: string;
  name: string;
  description: string;
  order: number;
  status: MenuStatusType;
  menuIds: string[];
}

export interface UpdateModulePayloadI {
  name: string;
  description: string;
  iconSvg?: string;
  route: string;
  order: number;
  status: MenuStatusType;
}

export interface UpdateCategoryPayloadI {
  name: string;
  description: string;
  route: string;
  order: number;
  status: MenuStatusType;
  moduleId: string;
  subCategoryId?: string;
}
