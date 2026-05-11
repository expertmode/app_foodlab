export const metadata = {
    title: 'Foodlab',
    description: 'Inovação alimentar com Foodlab e Via Food',
};

// /site routes ship their own header/footer via SiteShell. The kiosk's
// MainLayoutComp and ProdFooter are scoped out for /site in their own files,
// so the responsive design owns the full viewport here.
export default function SiteLayout({ children }) {
    return children;
}
