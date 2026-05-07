// Mapping picto text → SVG icon key. Shared between kiosk filter bar and product detail.

const ICON_BASE = '/images/pictos';

const RULES = [
    { key: 'proteina', label: 'Proteína', patterns: ['proteína', 'proteina', 'proteia'] },
    { key: 'fibra', label: 'Fibra', patterns: ['fibra'] },
    { key: 'circular', label: 'Economia circular', patterns: ['desperdício', 'desperdicio', 'economia circular', 'circular', 'co-produto', 'coproduto'] },
    { key: 'microalgas', label: 'Microalgas', patterns: ['microalga', 'micoralga', 'alga'] },
    { key: 'vegetal', label: 'Base vegetal', patterns: ['vegetal', 'leguminosa'] },
    { key: 'biologico', label: 'Biológico', patterns: ['biológico', 'biologico'] },
    { key: 'zero-alcool', label: '0,0% álcool', patterns: ['0,0%', '0.0%', 'álcool', 'alcool'] },
    { key: 'sem-gluten', label: 'Sem glúten', patterns: ['sem glúten', 'sem gluten'] },
    { key: 'sem-palma', label: 'Sem óleo de palma', patterns: ['palma'] },
    { key: 'sem-acucar', label: 'Sem açúcar', patterns: ['açúcar', 'acucar'] },
    { key: 'sem-corantes', label: 'Sem corantes', patterns: ['corante'] },
    { key: 'sem-conservantes', label: 'Sem conservantes', patterns: ['conservante'] },
    { key: 'menos-gordura', label: 'Menos gordura', patterns: ['gordura', 'gordo'] },
    { key: 'sem-aditivos', label: 'Sem aditivos', patterns: ['aditivo', 'amido modificado', 'sorbato'] },
    { key: 'fruta', label: 'Fruta', patterns: ['fruta'] },
    { key: 'inseto', label: 'Inseto', patterns: ['inseto'] },
    { key: 'mineral', label: 'Mineral', patterns: ['magnésio', 'magnesio', 'potássio', 'potassio', 'folato'] },
    { key: 'naturais', label: 'Ingredientes naturais', patterns: ['natural', 'naturais', 'ingredientes simples', 'extrato'] },
];

export function getPictoKey(text) {
    const t = (text || '').toLowerCase();
    for (const rule of RULES) {
        if (rule.patterns.some((p) => t.includes(p))) return rule.key;
    }
    return 'default';
}

export function getPictoIconUrl(key) {
    return `${ICON_BASE}/${key}.svg`;
}

export function getPictoIcon(text) {
    return getPictoIconUrl(getPictoKey(text));
}

export function getPictoLabel(key) {
    const r = RULES.find((x) => x.key === key);
    return r ? r.label : key;
}

// Returns sorted [{key, label, icon, count}] from a products array,
// for rendering the kiosk filter bar.
export function computePictoFilters(products) {
    const counts = new Map();
    for (const p of products || []) {
        const seen = new Set();
        for (const pic of p.pictos || []) {
            const key = getPictoKey(pic.text || '');
            if (key === 'default' || seen.has(key)) continue;
            seen.add(key);
            counts.set(key, (counts.get(key) || 0) + 1);
        }
    }
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => ({ key, count, label: getPictoLabel(key), icon: getPictoIconUrl(key) }));
}

export function productHasPicto(product, key) {
    if (!key) return true;
    if (!Array.isArray(product.pictos)) return false;
    return product.pictos.some((pic) => getPictoKey(pic.text || '') === key);
}
