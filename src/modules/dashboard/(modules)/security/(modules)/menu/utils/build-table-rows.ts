import type { MenuModuleI, MenuTableRowI, MenuStatusType } from "@/interfaces/security";

export function buildTableRows(
  modules: MenuModuleI[],
  expandedModules: Set<string>,
  expandedSubCats: Set<string>,
): MenuTableRowI[] {
  const rows: MenuTableRowI[] = [];

  for (const mod of modules) {
    const directItems = mod.categories.filter((c) => !c.subCategoryId);
    const totalChildren = mod.categories.length + mod.subCategories.length;

    rows.push({
      id: mod.id,
      rowType: "module",
      name: mod.name,
      description: mod.description,
      route: mod.route,
      order: mod.order,
      status: mod.status,
      childCount: totalChildren,
    });

    if (!expandedModules.has(mod.id)) continue;

    if (directItems.length > 0 || mod.subCategories.length > 0) {
      rows.push({
        id: `header-${mod.id}`,
        rowType: "category-header",
        name: mod.name,
        description: "",
        route: "",
        order: 0,
        status: "Activo" as MenuStatusType,
        parentModuleId: mod.id,
      });
    }

    for (const item of directItems) {
      rows.push({
        id: item.id,
        rowType: "menu-item",
        name: item.name,
        description: item.description,
        route: item.route,
        order: item.order,
        status: item.status,
        parentModuleId: mod.id,
        depth: 1,
      });
    }

    for (const subCat of mod.subCategories) {
      const subItems = mod.categories.filter((c) => c.subCategoryId === subCat.id);
      rows.push({
        id: subCat.id,
        rowType: "sub-category",
        name: subCat.name,
        description: subCat.description,
        route: "",
        order: subCat.order,
        status: subCat.status,
        parentModuleId: mod.id,
        childCount: subItems.length,
        depth: 1,
      });

      if (!expandedSubCats.has(subCat.id)) continue;

      for (const item of subItems) {
        rows.push({
          id: item.id,
          rowType: "sub-item",
          name: item.name,
          description: item.description,
          route: item.route,
          order: item.order,
          status: item.status,
          parentModuleId: mod.id,
          subCategoryId: subCat.id,
          depth: 2,
        });
      }
    }
  }

  return rows;
}
