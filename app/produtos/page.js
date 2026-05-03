import ProdutosContent from "./content";
import { readProducts } from "@/lib/products";

export const metadata = {
    title: "Lista de Produtos",
    description: "",
}

export default async function Produtos() {
    const products = await readProducts();
    return <ProdutosContent products={products} />;
}