import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { getSanityProductBySlug } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getSanityProductBySlug(slug);
    if (!product) {
        return { title: 'Producto no encontrado' };
    }
    return {
        title: `${product.title} | Montevida`,
        description: product.shortDescription || "Descubre más detalles sobre nuestro producto.",
    }
}

const ProductDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const product = await getSanityProductBySlug(slug);

    if (!product) {
        return notFound();
    }

    return (
        <main className="pt-10 lg:pt-16 xl:pt-20">
            <ShopDetails currentProduct={product} />
        </main>
    );
};

export default ProductDetailsPage;
