import ProdutosContent from "./content";
import { readProducts } from "@/lib/products";
import { readFilters } from "@/lib/filters";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Lista de Produtos",
    description: "",
}

export default async function Produtos() {
    const [allProducts, filters] = await Promise.all([readProducts(), readFilters()]);
    const products = allProducts.filter((p) => !p.hidden);
    return <ProdutosContent products={products} filters={filters} />;
}