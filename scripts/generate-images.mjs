#!/usr/bin/env node
// Gerador de imagens via Replicate (Flux).
// Uso:
//   node scripts/generate-images.mjs                       # tudo (flux-schnell)
//   node scripts/generate-images.mjs --model=flux-dev      # qualidade superior
//   node scripts/generate-images.mjs --only=cards          # só cards
//   node scripts/generate-images.mjs --only=main           # só img_main
//   node scripts/generate-images.mjs --only=bg             # só img_bg
//   node scripts/generate-images.mjs --only=bottom         # só bottom_img
//   node scripts/generate-images.mjs --dry-run             # mostra o plano sem chamar a API
//   node scripts/generate-images.mjs --concurrency=5       # nº de pedidos em paralelo

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
        const [k, v] = a.replace(/^--/, '').split('=');
        return [k, v ?? true];
    }),
);
const ONLY = args.only;
const DRY = args['dry-run'];
const CONCURRENCY = parseInt(args.concurrency || '3', 10);
const LIMIT = args.limit ? parseInt(args.limit, 10) : null;
const PRODUCT = args.product ? parseInt(args.product, 10) : null;

const MODELS = {
    'flux-schnell': { slug: 'black-forest-labs/flux-schnell', cost: 0.003 },
    'flux-dev': { slug: 'black-forest-labs/flux-dev', cost: 0.025 },
    'flux-pro': { slug: 'black-forest-labs/flux-1.1-pro', cost: 0.04 },
};
const MODEL_KEY = args.model || 'flux-schnell';
const MODEL = MODELS[MODEL_KEY];
if (!MODEL) {
    console.error(`Modelo desconhecido: ${MODEL_KEY}. Opções: ${Object.keys(MODELS).join(', ')}`);
    process.exit(1);
}

const env = {};
try {
    const txt = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8');
    for (const line of txt.split('\n')) {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
} catch {
    console.error('Não consegui ler .env.local');
    process.exit(1);
}

const API_TOKEN = env.REPLICATE_API_TOKEN;
if (!API_TOKEN && !DRY) {
    console.error('Falta REPLICATE_API_TOKEN em .env.local');
    console.error('Vai a https://replicate.com/account/api-tokens');
    process.exit(1);
}

const data = JSON.parse(
    await fs.readFile(path.join(ROOT, 'data/productsData.json'), 'utf8'),
);

const STYLE_BASE =
    'realistic food photography, soft natural light, light beige neutral background, minimal composition, shallow depth of field, warm natural colors, no text, no logos, high quality';

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function cardPrompt(desc, productTitle = '', productSubtitle = '', productDesc = '') {
    const STYLE = 'fine-art editorial photography, hyper-realistic, soft natural directional light, painterly composition, shallow depth of field, neutral warm tones, balanced composition with 2-3 simple elements, intentional negative space, calm and uncluttered, no overflow, no text, no logos, no packaging, no human face';
    const FORBID = 'STRICT RULES: 1) NEVER show any full assembled product (no full burger, no full pesto jar, no full plated dish, no full sandwich, no complete packaged item). 2) Avoid scenes with many foods piled together (no fruit baskets, no abundance, no overflowing tables). 3) Composition should feel calm and intentional — a few well-placed elements with breathing room.';
    const d = desc.toLowerCase();
    const has = (...kw) => kw.some((k) => d.includes(k));

    // Each subject describes ingredient close-ups OR abstract concepts — never the full product
    let subject = '';
    if (has('aparas de pescado', 'aparas de peixe', 'aproveitamento de pescado', 'aproveitamento do peixe'))
        subject = 'extreme close-up of fresh raw fish fillets and trimmings on parchment paper, scattered herbs and lemon, ingredient still life only';
    else if (has('híbrido', 'hibrido') || (has('proteína animal') && has('vegetal')))
        subject = 'split-frame still life: on the left a small portion of raw fish fillet, on the right a small bowl of legumes — only the raw ingredients side by side, no cooked product';
    else if (has('crianç', 'infantil', 'crescer', 'miúdos'))
        subject = 'silhouette of a small child hand gently reaching toward a single piece of fresh fruit on a wooden table, soft golden window light, calm composition';
    else if (has('mastigação', 'sénior', 'idoso'))
        subject = 'weathered elderly hands holding a wooden spoon over a small ceramic bowl with simple cooked food, soft window light, calm composition';
    else if (has('hortícolas', 'horticolas', 'invisível', 'invisivel') || (has('vegetais') && has('integraç')))
        subject = 'extreme close-up of colorful fresh vegetables being finely chopped on a wooden board (carrot, courgette, herbs), only ingredients';
    else if (has('subproduto', 'coproduto', 'pomace', 'okara', 'desperdício', 'desperdicio', 'circular', 'redução de desperdício', 'reduzindo desperdício'))
        subject = 'hands cradling raw natural ingredient offcuts (peels, fibers, husks), conceptual circular economy, soft warm light';
    else if (has('conveniência', 'conveniencia', 'prática', 'pratica', 'pronta a aquecer', 'pronto a consumir', 'pronto a usar', 'on-the-go', 'on the go'))
        subject = 'a vintage clock and a fresh herb sprig on linen surface, soft warm window light, calm conceptual still life of time and freshness';
    else if (has('saúde', 'saude', 'wellness', 'bem-estar', 'equilibrad', 'leveza', 'leve'))
        subject = 'serene wellness still life — water glass, fresh leafy greens, soft morning light, no plated dish';
    else if (has('familia', 'família', 'partilhar'))
        subject = 'two pairs of hands gently meeting over a shared piece of bread on linen, soft warm light, conceptual sharing';
    else if (has('crocant', 'crocante', 'snack', 'topping'))
        subject = 'extreme close-up of golden crispy texture of a single grain or seed, ingredient detail only';
    else if (has('cremos', 'spread', 'barrar', 'creme', 'textura cremosa'))
        subject = 'extreme close-up of glossy creamy ingredient texture on wooden spoon, no jar, no full product';
    else if (has('sabor', 'sabores diferenciados', 'aroma', 'sensorial', 'condimento', 'tempero', 'paprika', 'picante', 'jalapen'))
        subject = 'aromatic raw spices and fresh herbs scattered on dark linen, ingredient still life';
    else if (has('cura', 'fermenta'))
        subject = 'glass jar with bubbles of naturally fermenting starter against window light, conceptual time and transformation';
    else if (has('liofiliz', 'desidrat'))
        subject = 'extreme close-up of freeze-dried fruit pieces on white linen, ingredient texture only';
    else if (has('hpp', 'high pressure', 'high-pressure', 'pre-industri', 'tecnologia', 'pressão', 'pressao'))
        subject = 'soft hands arranging raw vivid ingredients on clean modern surface, conceptual craft meets innovation';
    else if (has('embalagem', 'lata', 'recicl'))
        subject = 'minimalist abstract still life of folded recycled cardboard and a single leaf on neutral linen, conceptual sustainability, no labeled package';
    else if (has('biológico', 'biologico', 'orgânico', 'organico'))
        subject = 'extreme close-up of organic wheat ear at golden hour in a field, single ingredient detail';
    else if (has('açúcar', 'acucar', 'sem açúcar'))
        subject = 'single sugar cube melting on white linen with shadow, conceptual minimal idea of reduction';
    else if (has('óleo de palma', 'oleo de palma', 'sem palma') || has('azeite'))
        subject = 'extreme close-up of a single golden olive oil drop frozen mid-fall against soft beige background, ingredient only';
    else if (has('proteína de leguminosa', 'leguminos', 'tremoço', 'grão-de-bico', 'lentilha', 'feijão', 'ervilha'))
        subject = 'overhead extreme close-up of a variety of raw legumes (lupin, chickpeas, lentils) in small ceramic bowls, ingredient still life';
    else if (has('microalga', 'micoralga', 'chlorella', 'tetraselmis', 'spirulina'))
        subject = 'extreme close-up of green microalgae powder swirling in soft beam of light, single ingredient ethereal';
    else if (has('inseto'))
        subject = 'extreme close-up of cricket flour in a small ceramic dish, ingredient still life';
    else if (has('levedura', 'yeast'))
        subject = 'extreme close-up of golden yeast flakes spilling from glass jar, single ingredient texture';
    else if (has('algas', 'soro de leite', 'whey'))
        subject = 'single delicate seaweed strand floating in clear water, soft light, ingredient only';
    else if (has('castanha'))
        subject = 'extreme close-up of a single chestnut held in an open palm, autumn warmth, ingredient detail';
    else if (has('beterraba'))
        subject = 'extreme close-up of vivid magenta raw beetroot halves on rustic linen, ingredient only';
    else if (has('queijo', 'curado'))
        subject = 'extreme close-up of cured cheese rind texture on dark wood, ingredient texture only';
    else if (has('pão', 'pao', 'farinh', 'cereal', 'bolo de arroz'))
        subject = 'flour-dusted hands kneading raw dough on wooden board, soft light, ingredient process only';
    else if (has('fruta') || has('maçã') || has('maca') || has('tropical') || has('pera') || has('morango') || has('kiwi'))
        subject = 'extreme close-up of fresh raw fruit half with water droplets, ingredient only';
    else if (has('proteína', 'proteina'))
        subject = 'natural raw protein-rich ingredients (a handful of legumes and seeds) arranged poetically on linen, ingredient still life';
    else if (has('fibra'))
        subject = 'extreme close-up of whole grains and seeds spilling over wooden board, single ingredient detail';
    else if (has('versát', 'versat', 'aplicaç', 'múltiplas aplicações', 'multiplas'))
        subject = 'three small empty ceramic plates arranged in soft afternoon light, conceptual idea of multiple possibilities';
    else if (has('tradicional', 'tradição', 'caseiro'))
        subject = 'vintage hand-written recipe paper next to old wooden utensils, conceptual heritage, no food';
    else if (has('local', 'portugu', 'alentejo', 'região'))
        subject = 'Portuguese countryside golden hour, weathered farmer hands holding raw grains, no plated food';
    else
        subject = 'minimal still life of natural raw ingredients arranged on linen with soft window light, ingredient close-up only';

    const visualHint = ` Visual subject: ${subject}.`;
    const palette = productTitle ? ` Color palette subtly inspired by "${productTitle}".` : '';
    return `An editorial photograph illustrating this caption: "${desc}".${visualHint}${palette} ${FORBID} ${STYLE}`;
}

function productPrompt(p, kind) {
    const title = clean(p.title).replace(/\n/g, ' ');
    const ctx = clean(p.description);
    if (kind === 'img_main')
        return `food product "${title}" isolated on neutral white background, professional packaging photography, slightly angled front view, soft studio lighting, natural shadow, no text on packaging`;
    if (kind === 'img_bg')
        return `Hyperrealistic editorial food photography, extreme close-up macro shot, top-down overhead flat-lay (camera pointing straight down at 90 degrees). Subject: the surface of "${title}" — show only the texture filling the entire frame. ${ctx ? `Product description: ${ctx}` : ''} Render the actual ingredients of this specific product visually (e.g., if fish: flaky white fish meat with golden sear; if pesto: green basil leaves and oil; if cheese: marbled creamy texture; if tomato: red tomato pulp; etc.). Ultra-sharp micro detail: visible fibers, grains, droplets, herbs, glossy moisture. Vivid natural colors faithful to the ingredients. Frame is filled 100% edge-to-edge with the texture only — no full object visible, no plate, no edges. Panoramic horizontal composition. Soft natural directional lighting, shallow depth of field. No text, no logos, no packaging, no human, no tilt, no perspective angle.`;
    if (kind === 'bottom_img')
        return `artistic close-up of a unique detail of "${title}" — texture, main ingredient, water droplet — clean composition, ${STYLE_BASE}`;
}

const aspectFor = (kind) => {
    if (kind === 'bg') return '16:9';
    if (kind === 'bottom') return '9:16';
    return '1:1';
};

const formatFor = (out) => (out.endsWith('.png') ? 'png' : 'jpg');

const jobs = [];
for (const p of data) {
    if (PRODUCT !== null && p.id !== PRODUCT) continue;
    if (ONLY === 'main' && p.imgProd)
        jobs.push({ kind: 'main', prompt: productPrompt(p, 'img_main'), out: p.imgProd });
    if ((!ONLY || ONLY === 'bg') && p.imgBg)
        jobs.push({ kind: 'bg', prompt: productPrompt(p, 'img_bg'), out: p.imgBg });
    if ((!ONLY || ONLY === 'bottom') && p.bottomImg)
        jobs.push({ kind: 'bottom', prompt: productPrompt(p, 'bottom_img'), out: p.bottomImg });
    if (!ONLY || ONLY === 'cards')
        for (const c of p.infoCards || [])
            if (c.image)
                jobs.push({
                    kind: 'card',
                    prompt: cardPrompt(
                        clean(c.desc),
                        clean(p.title).replace(/\n/g, ' '),
                        clean(p.subTitle).replace(/\n/g, ' '),
                        clean(p.description),
                    ),
                    out: c.image,
                });
}

const fileExists = async (p) => {
    try { await fs.access(p); return true; } catch { return false; }
};

let todo = [];
let alreadyExists = 0;
for (const j of jobs) {
    const abs = path.join(ROOT, 'public', j.out);
    if (await fileExists(abs)) alreadyExists++;
    else todo.push({ ...j, abs });
}
if (LIMIT) todo = todo.slice(0, LIMIT);

console.log(`Modelo: ${MODEL_KEY} (${MODEL.slug})`);
console.log(`Total jobs: ${jobs.length}`);
console.log(`Já existem (saltam): ${alreadyExists}`);
console.log(`A gerar: ${todo.length}`);
console.log(`Custo estimado: $${(todo.length * MODEL.cost).toFixed(2)}`);
console.log(`Concorrência: ${CONCURRENCY}\n`);

if (DRY) {
    console.log('--- DRY RUN — exemplos de prompts ---');
    for (const j of todo.slice(0, 5))
        console.log(`[${j.kind}] ${j.out}\n  → ${j.prompt}\n`);
    process.exit(0);
}

async function generate(prompt, kind, out) {
    let res;
    for (let attempt = 0; attempt < 5; attempt++) {
        res = await fetch(
            `https://api.replicate.com/v1/models/${MODEL.slug}/predictions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`,
                    Prefer: 'wait',
                },
                body: JSON.stringify({
                    input: {
                        prompt,
                        aspect_ratio: aspectFor(kind),
                        output_format: formatFor(out),
                        num_outputs: 1,
                        output_quality: 90,
                    },
                }),
            },
        );
        if (res.status !== 429) break;
        const body = await res.json().catch(() => ({}));
        const wait = (body.retry_after ?? 10) * 1000 + 500;
        console.log(`   [429] rate limit — esperar ${Math.ceil(wait / 1000)}s e tentar de novo...`);
        await new Promise((r) => setTimeout(r, wait));
    }

    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    const json = await res.json();
    if (json.status === 'failed') throw new Error(`prediction failed: ${json.error}`);

    let urls = json.output;
    if (!urls) {
        // fallback: poll
        let attempts = 0;
        while (attempts++ < 30) {
            await new Promise((r) => setTimeout(r, 2000));
            const r = await fetch(json.urls.get, {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
            });
            const j = await r.json();
            if (j.status === 'succeeded') { urls = j.output; break; }
            if (j.status === 'failed') throw new Error(`prediction failed: ${j.error}`);
        }
    }
    if (!urls) throw new Error('timeout waiting for prediction');
    const url = Array.isArray(urls) ? urls[0] : urls;
    const imgRes = await fetch(url);
    if (!imgRes.ok) throw new Error(`download ${imgRes.status}`);
    return Buffer.from(await imgRes.arrayBuffer());
}

let done = 0, saved = 0, failed = 0;
const failures = [];

async function worker(items) {
    while (items.length) {
        const j = items.shift();
        const i = ++done;
        try {
            const buf = await generate(j.prompt, j.kind, j.out);
            await fs.mkdir(path.dirname(j.abs), { recursive: true });
            await fs.writeFile(j.abs, buf);
            saved++;
            console.log(`[${i}/${todo.length}] OK   ${j.kind.padEnd(6)} ${j.out}`);
        } catch (e) {
            failed++;
            failures.push({ out: j.out, error: e.message });
            console.error(`[${i}/${todo.length}] FAIL ${j.kind.padEnd(6)} ${j.out} — ${e.message}`);
        }
    }
}

const queue = [...todo];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

console.log(`\n=== Resumo ===`);
console.log(`Geradas: ${saved}`);
console.log(`Falhadas: ${failed}`);
if (failures.length) {
    console.log(`\nFalhas:`);
    for (const f of failures) console.log(`  ${f.out}: ${f.error}`);
}
