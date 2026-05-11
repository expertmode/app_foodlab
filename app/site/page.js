import { readProducts } from '@/lib/products';
import { readBanners } from '@/lib/banners';
import SiteShell from '@/components/site/SiteShell';
import HomeBannersHero from '@/components/site/HomeBannersHero';
import HomeAbout from '@/components/site/HomeAbout';
import HomeProductsTeaser from '@/components/site/HomeProductsTeaser';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Foodlab · Inovação alimentar',
    description: 'Conhece os produtos do Foodlab — sabor de sempre, pensado no futuro.',
};

export default async function SiteHome() {
    const [allProducts, banners] = await Promise.all([readProducts(), readBanners()]);
    const products = allProducts.filter((p) => !p.hidden);
    const sortedBanners = (banners || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <SiteShell $heroOverlap>
            <HomeBannersHero banners={sortedBanners} />
            <HomeAbout />
            <HomeProductsTeaser products={products} />
        </SiteShell>
    );
}
