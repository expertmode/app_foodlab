const ICON_BASE = "/images/pictos";

const rules = [
    { icon: "proteina", patterns: ["proteína", "proteina"] },
    { icon: "fibra", patterns: ["fibra"] },
    { icon: "circular", patterns: ["desperdício", "desperdicio", "economia circular", "circular"] },
    { icon: "microalgas", patterns: ["microalga", "micoralga", "alga"] },
    { icon: "vegetal", patterns: ["vegetal", "leguminosa"] },
    { icon: "biologico", patterns: ["biológico", "biologico"] },
    { icon: "zero-alcool", patterns: ["0,0%", "0.0%", "álcool", "alcool"] },
    { icon: "sem-gluten", patterns: ["sem glúten", "sem gluten"] },
    { icon: "sem-palma", patterns: ["palma"] },
    { icon: "sem-acucar", patterns: ["açúcar", "acucar"] },
    { icon: "sem-corantes", patterns: ["corante"] },
    { icon: "sem-conservantes", patterns: ["conservante"] },
    { icon: "menos-gordura", patterns: ["gordura", "gordo"] },
    { icon: "sem-aditivos", patterns: ["aditivo", "amido modificado", "sorbato"] },
    { icon: "fruta", patterns: ["fruta"] },
    { icon: "inseto", patterns: ["inseto"] },
    { icon: "mineral", patterns: ["magnésio", "magnesio", "potássio", "potassio", "folato"] },
    { icon: "naturais", patterns: ["natural", "naturais", "ingredientes simples", "extrato"] },
];

export function getPictoIcon(text) {
    const t = (text || "").toLowerCase();
    for (const rule of rules) {
        if (rule.patterns.some((p) => t.includes(p))) {
            return `${ICON_BASE}/${rule.icon}.svg`;
        }
    }
    return `${ICON_BASE}/default.svg`;
}
