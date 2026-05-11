import { readProducts } from '@/lib/products';
import SiteShell from '@/components/site/SiteShell';
import HomeHero from '@/components/site/HomeHero';
import HomeIntro from '@/components/site/HomeIntro';
import HomeProductsTeaser from '@/components/site/HomeProductsTeaser';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Foodlab · Inovação alimentar',
    description: 'Conhece os produtos do Foodlab — sabor de sempre, pensado no futuro.',
};

export default async function SiteHome() {
    const all = await readProducts();
    const products = all.filter((p) => !p.hidden);

    return (
        <SiteShell>
            <HomeHero />
            <HomeIntro />
            <HomeProductsTeaser products={products} />
        </SiteShell>
    );
}
