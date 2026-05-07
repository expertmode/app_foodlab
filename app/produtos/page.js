import ProdutosContent from "./content";
import { readProducts } from "@/lib/products";
import { computePictoFilters } from "@/lib/pictos";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Lista de Produtos",
    description: "",
}

export default async function Produtos() {
    const allProducts = await readProducts();
    const products = allProducts.filter((p) => !p.hidden);
    const pictoFilters = computePictoFilters(products);
    return <ProdutosContent products={products} pictoFilters={pictoFilters} />;
}