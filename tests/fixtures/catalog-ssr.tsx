import { renderToStaticMarkup } from "react-dom/server";
import CatalogClient from "../../components/CatalogClient";
import { StoreProvider } from "../../components/StoreProvider";
import type { CatalogFilters } from "../../lib/catalog-routing";

// Import the actual tree in one module so the provider and cards use the same
// context instance in the tsx test loader, as they do in the application bundle.
export function renderCatalog(filters: CatalogFilters): string {
  return renderToStaticMarkup(<StoreProvider><CatalogClient
    initialQuery={filters.query} initialCategory={filters.category} initialGrade={filters.grade}
    initialTag={filters.tag} initialSort={filters.sort} initialView={filters.view} initialPage={filters.page}
  /></StoreProvider>);
}
