const MODELS = {
    'flux-schnell': { slug: 'black-forest-labs/flux-schnell', cost: 0.003 },
    'flux-dev': { slug: 'black-forest-labs/flux-dev', cost: 0.025 },
    'flux-pro': { slug: 'black-forest-labs/flux-1.1-pro', cost: 0.04 },
};

export async function generateImage({ prompt, aspectRatio = '1:1', outputFormat = 'jpg', model = 'flux-dev', referenceImage, referenceStrength = 0.7 }) {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error('REPLICATE_API_TOKEN missing');
    // Force flux-dev when there's a reference (schnell doesn't support image input)
    if (referenceImage && model === 'flux-schnell') model = 'flux-dev';
    const m = MODELS[model];
    if (!m) throw new Error(`Unknown model: ${model}`);

    let res;
    for (let attempt = 0; attempt < 5; attempt++) {
        res = await fetch(
            `https://api.replicate.com/v1/models/${m.slug}/predictions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Prefer: 'wait',
                },
                body: JSON.stringify({
                    input: {
                        prompt,
                        aspect_ratio: aspectRatio,
                        output_format: outputFormat,
                        num_outputs: 1,
                        output_quality: 90,
                        ...(referenceImage ? { image: referenceImage, prompt_strength: 1 - referenceStrength } : {}),
                    },
                }),
            },
        );
        if (res.status !== 429) break;
        const body = await res.json().catch(() => ({}));
        const wait = (body.retry_after ?? 10) * 1000 + 500;
        await new Promise((r) => setTimeout(r, wait));
    }

    if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);
    const json = await res.json();
    if (json.status === 'failed') throw new Error(`prediction failed: ${json.error}`);

    let urls = json.output;
    if (!urls) {
        for (let attempt = 0; attempt < 30; attempt++) {
            await new Promise((r) => setTimeout(r, 2000));
            const r = await fetch(json.urls.get, {
                headers: { Authorization: `Bearer ${token}` },
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
