import { readProducts } from '@/lib/products';
import { computePictoFilters } from '@/lib/pictos';
import SiteShell from '@/components/site/SiteShell';
import ProductsListView from '@/components/site/ProductsListView';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Produtos · Foodlab',
    description: 'Todos os produtos desenvolvidos pelo Foodlab.',
};

export default async function SiteProdutos() {
    const all = await readProducts();
    const products = all.filter((p) => !p.hidden);
    const filters = computePictoFilters(products);

    return (
        <SiteShell>
            <ProductsListView products={products} filters={filters} />
        </SiteShell>
    );
}
