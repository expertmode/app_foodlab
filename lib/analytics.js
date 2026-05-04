import { getCollection } from './db';

export async function track(event) {
    if (!process.env.MONGODB_URI) return;
    try {
        const col = await getCollection('analytics');
        await col.insertOne({
            ts: Date.now(),
            type: event.type,
            ref: event.ref || null,
            meta: event.meta || null,
        });
    } catch (e) {
        // analytics failures shouldn't break the site
        console.error('analytics track:', e.message);
    }
}

// Devolve agregações de eventos para o admin
export async function getStats({ days = 30 } = {}) {
    const col = await getCollection('analytics');
    const since = Date.now() - days * 24 * 60 * 60 * 1000;
    const events = await col.find({ ts: { $gte: since } }).toArray();

    const total = events.length;
    const byType = {};
    const byRef = {};
    const byDay = {};
    const byTypeDay = {};

    for (const ev of events) {
        byType[ev.type] = (byType[ev.type] || 0) + 1;
        if (ev.ref) {
            const k = `${ev.type}:${ev.ref}`;
            byRef[k] = (byRef[k] || 0) + 1;
        }
        const day = new Date(ev.ts).toISOString().slice(0, 10);
        byDay[day] = (byDay[day] || 0) + 1;
        if (!byTypeDay[ev.type]) byTypeDay[ev.type] = {};
        byTypeDay[ev.type][day] = (byTypeDay[ev.type][day] || 0) + 1;
    }

    // Top produtos vistos
    const productViews = Object.entries(byRef)
        .filter(([k]) => k.startsWith('product_view:'))
        .map(([k, v]) => ({ id: Number(k.split(':')[1]), count: v }))
        .sort((a, b) => b.count - a.count);

    // Top filtros clicados
    const filterClicks = Object.entries(byRef)
        .filter(([k]) => k.startsWith('filter_click:'))
        .map(([k, v]) => ({ id: Number(k.split(':')[1]), count: v }))
        .sort((a, b) => b.count - a.count);

    // Banner clicks (que produto/banner foi clicado para abrir)
    const bannerViews = Object.entries(byRef)
        .filter(([k]) => k.startsWith('banner_view:'))
        .map(([k, v]) => ({ id: Number(k.split(':')[1]), count: v }))
        .sort((a, b) => b.count - a.count);

    return {
        total,
        days,
        byType,
        byDay,
        byTypeDay,
        productViews,
        filterClicks,
        bannerViews,
    };
}
