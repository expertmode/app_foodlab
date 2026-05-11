import { readProducts } from '@/lib/products';
import { readCatalogConfig } from '@/lib/catalog';
import PrintCover from '@/components/print/PrintCover';
import PrintBlank from '@/components/print/PrintBlank';
import PrintIndex from '@/components/print/PrintIndex';
import PrintProduct from '@/components/print/PrintProduct';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Catálogo PDF',
    robots: { index: false, follow: false },
};

export default async function PrintCatalog({ searchParams }) {
    const sp = await searchParams;
    const idsRaw = sp?.ids || '';
    const ids = String(idsRaw).split(',').map((s) => parseInt(s, 10)).filter((n) => Number.isFinite(n));

    const [allProducts, cfg] = await Promise.all([readProducts(), readCatalogConfig()]);
    const byId = new Map(allProducts.map((p) => [p.id, p]));
    const selected = ids.map((id) => byId.get(id)).filter(Boolean);

    if (!selected.length) {
        return (
            <PrintShell>
                <div style={{ padding: '24mm', fontFamily: 'system-ui' }}>
                    <h1>Sem produtos selecionados</h1>
                    <p>Acrescenta IDs ao URL: <code>?ids=1,2,3</code></p>
                </div>
            </PrintShell>
        );
    }

    // Compute page numbers for the index
    let nextPage = 1;
    const coverPage = nextPage++; // 1
    const blankPage = cfg.blankPage.enabled ? nextPage++ : null;
    const indexStart = nextPage++;
    // Pre-allocate index pages: estimate rows per page = 22, so:
    const ROWS_PER_PAGE = 22;
    const indexPagesCount = Math.max(1, Math.ceil(selected.length / ROWS_PER_PAGE));
    nextPage = indexStart + indexPagesCount;

    const indexItems = selected.map((p) => {
        const item = { id: p.id, title: p.title, partner: p.partner, page: nextPage };
        nextPage += 1; // 1 page per product
        return item;
    });

    return (
        <PrintShell>
            <PrintCover cover={cfg.cover} />
            {cfg.blankPage.enabled && <PrintBlank note={cfg.blankPage.note} />}
            <PrintIndex title={cfg.index.title} items={indexItems} footer={cfg.footer.text} startPage={indexStart} />
            {selected.map((p, i) => (
                <PrintProduct
                    key={p.id}
                    product={p}
                    pageNumber={indexItems[i].page}
                    footer={cfg.footer.text}
                />
            ))}
        </PrintShell>
    );
}

function PrintShell({ children }) {
    return (
        <>
            <style>{`
                @page { size: A4 portrait; margin: 0; }
                html, body { background: #fff; margin: 0; padding: 0; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @media screen {
                    body { background: #444; padding: 12mm 0; }
                }
            `}</style>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                {children}
            </div>
        </>
    );
}
