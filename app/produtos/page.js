import ProdutosContent from "./content";
import { readProducts } from "@/lib/products";
import { readFilters } from "@/lib/filters";

export const metadata = {
    title: "Lista de Produtos",
    description: "",
}

export default async function Produtos() {
    const [products, filters] = await Promise.all([readProducts(), readFilters()]);
    return <ProdutosContent products={products} filters={filters} />;
}