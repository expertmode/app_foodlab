import { notFound } from 'next/navigation';
import { readProducts } from '@/lib/products';
import SiteShell from '@/components/site/SiteShell';
import ProductDetailView from '@/components/site/ProductDetailView';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { keyName } = await params;
    const products = await readProducts();
    const p = products.find((x) => x.keyName === keyName);
    if (!p) return { title: 'Produto · Foodlab' };
    return {
        title: `${(p.title || '').replace(/\n/g, ' ')} · Foodlab`,
        description: p.subTitle || p.description?.slice(0, 160) || '',
    };
}

export default async function SiteProdutoDetail({ params }) {
    const { keyName } = await params;
    const products = await readProducts();
    const product = products.find((p) => p.keyName === keyName);

    if (!product) notFound();

    return (
        <SiteShell>
            <ProductDetailView product={product} />
        </SiteShell>
    );
}
