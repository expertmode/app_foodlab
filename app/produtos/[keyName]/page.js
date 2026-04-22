import data from "../../../data/productsData.json";

export function generateStaticParams() {
    return data.map((product) => ({
        keyName: product.keyName,
    }));
}

export default async function ProductDetail({ params }) {
    const { keyName } = await params;
    const product = data.find((p) => p.keyName === keyName);

    if (!product) {
        return <div>Produto não encontrado</div>;
    }

    return <div>{/* Layout será feito aqui */}</div>;
}
